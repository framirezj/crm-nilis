import { createClient } from "@/lib/supabase/server";
import { getJobById } from "@/features/jobs/services/jobs.service";
import { getClientById } from "@/features/clients/services/clients.service";
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
  IconCurrencyDollar,
  IconUser,
  IconArrowLeft,
} from "@tabler/icons-react";
import { notFound } from "next/navigation";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job, error } = await getJobById(supabase, id);

  // Si no se encuentra el trabajo o hay un error (ej. id inválido)
  if (error || !job || job.length === 0) {
    notFound();
  }

  const jobData = job[0];
  const client = await getClientById(supabase, jobData.client_id);

  return (
    <Container size="xl" mt="md">
      <Button
        component="a"
        href={`/clients/${client?.id}`}
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        mb="md"
        px={0}
      >
        Volver
      </Button>

      <Paper shadow="xs" p="xl" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={2}>{jobData.title}</Title>
          <Badge size="lg" color="yellow" variant="light">
            {jobData.status || "Pendiente"}
          </Badge>
        </Group>

        <Flex
          gap="sm"
          direction={{ base: "column", md: "row" }}
          align="flex-start"
        >
          <Box w={{ base: "100%", md: "66%" }}>
            <Stack gap="md">
              <div>
                <Paper radius="md">
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
                </Paper>
              </div>
            </Stack>
          </Box>
          <Box w={{ base: "100%", md: "66%" }}>
            <Stack gap="md">
              <div>
                <Paper withBorder p="md" radius="md">
                  <Text fw={600} size="sm" mb={8} c="dimmed">
                    Descripción del Trabajo
                  </Text>
                  <Text fw={700}>
                    {jobData.description ||
                      "Sin descripción detallada registrada."}
                  </Text>
                </Paper>
              </div>
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
                      {jobData.created_at
                        ? new Date(jobData.created_at).toLocaleDateString(
                            "es-CL",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
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
