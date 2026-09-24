import { createClient } from "@/lib/supabase/server";
import { getJobById } from "@/features/jobs/services/jobs.service";
import { getClientById } from "@/features/clients/services/clients.service";
import { getServicios } from "@/features/servicios/services/servicios.service";
import {
  Title,
  Container,
  Paper,
  Text,
  Group,
  Stack,
  Badge,
  Flex,
  Box,
  Button,
} from "@mantine/core";
import {
  IconCalendar,
  IconUser,
  IconArrowLeft,
  IconScissors,
} from "@tabler/icons-react";
import { notFound } from "next/navigation";
import EditJobButton from "@/features/jobs/components/EditJobButton";
import JobServiciosTable from "@/features/jobs/components/JobServiciosTable";
import Link from "next/link";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: job, error }, catalogoServicios] = await Promise.all([
    getJobById(supabase, id),
    getServicios(supabase),
  ]);

  if (error || !job || job.length === 0) {
    notFound();
  }

  const jobData = job[0];
  const jobServicios = jobData.job_servicios ?? [];
  const client = await getClientById(supabase, jobData.client_id);

  return (
    <Container size="xl" mt="md">
      <Group justify="space-between" mb="md">
        <Link
          href={`/clients/${client?.id}`}
          style={{ textDecoration: "none" }}
        >
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            px={0}
          >
            Volver
          </Button>
        </Link>

        <EditJobButton
          job={jobData}
          initialServicios={jobServicios}
          catalogoServicios={catalogoServicios}
        />
      </Group>

      <Paper shadow="xs" p="xl" withBorder>
        <Group justify="space-between" mb="md">
          <Group>
            <Title order={2}>{jobData.title}</Title>
            <Badge size="lg" color="yellow" variant="light">
              {jobData.status || "Pendiente"}
            </Badge>
          </Group>
        </Group>

        <Text fw={700} size="xl" c="violet">
          {jobData.price != null
            ? new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
              }).format(jobData.price)
            : "-"}
        </Text>
        <Text fw={600} size="sm" mb={8} c="dimmed">
          Precio Acordado
        </Text>

        <Flex
          gap="sm"
          direction={{ base: "column", md: "row" }}
          align="flex-start"
        >
          <Box w={{ base: "100%", md: "66%" }}>
            <Stack gap="md">
              <Paper withBorder p="md" radius="md">
                <Group gap="xs" mb="sm">
                  <IconScissors size={16} color="var(--mantine-color-gray-6)" stroke={1.5} />
                  <Text fw={600} size="sm" c="dimmed">
                    Servicios realizados
                  </Text>
                </Group>
                <JobServiciosTable
                  servicios={jobServicios}
                  total={jobData.price}
                />
              </Paper>

              {/* Descripción / notas */}
              {jobData.description && (
                <Paper withBorder p="md" radius="md">
                  <Text fw={600} size="sm" mb={8} c="dimmed">
                    Notas
                  </Text>
                  <Text fw={700}>{jobData.description}</Text>
                </Paper>
              )}
            </Stack>
          </Box>

          <Box w={{ base: "100%", md: "34%" }}>
            <Paper withBorder p="md" radius="md">
              <Stack gap="lg">
                <Group wrap="nowrap">
                  <IconCalendar
                    size={24}
                    color="var(--mantine-color-gray-6)"
                    stroke={1.5}
                  />
                  <div>
                    <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                      Fecha de creación
                    </Text>
                    <Text fw={500}>
                      {jobData.date
                        ? new Date(jobData.date).toLocaleDateString("es-CL", {
                            timeZone: "UTC",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </Text>
                  </div>
                </Group>

                <Group wrap="nowrap">
                  <IconUser
                    size={24}
                    color="var(--mantine-color-gray-6)"
                    stroke={1.5}
                  />
                  <div>
                    <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                      Cliente Asociado
                    </Text>
                    <Text
                      component="a"
                      href={`/clients/${client?.id}`}
                      fw={500}
                      style={{ textDecoration: "none" }}
                      className="hover:underline" // Mantine no siempre maneja este hover muy simple en next/link así que usamos clase base
                    >
                      {client?.name || "Cliente Desconocido"}
                    </Text>
                  </div>
                </Group>
              </Stack>
            </Paper>
          </Box>
        </Flex>
      </Paper>
    </Container>
  );
}
