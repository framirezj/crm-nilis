"use client";

import { useState } from "react";
import {
  Button,
  Group,
  Stack,
  TextInput,
  Title,
  Paper,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Job } from "../types/jobs.type";
import { createJob, updateJob } from "../services/jobs.service";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

interface JobFormProps {
  initialData?: Job | null;
  clientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function JobForm({
  initialData,
  clientId,
  onSuccess,
  onCancel,
}: JobFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  const form = useForm({
    initialValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
    },

    validate: {
      title: (value) => (value.length < 2 ? "El título es obligatorio" : null),
      price: (value) => (value < 0 ? "El precio no puede ser negativo" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      if (initialData?.id) {
        const { error: updateError } = await updateJob(
          supabase,
          initialData.id,
          { ...values, client_id: clientId },
        );
        if (updateError) throw updateError;
      } else {
        const { error: createError } = await createJob(supabase, {
          ...values,
          client_id: clientId,
        });
        if (createError) throw createError;
      }

      form.reset();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar el trabajo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" withBorder radius="md">
      <Stack gap="md">
        <Title order={3}>
          {initialData ? "Editar Trabajo" : "Nuevo Trabajo"}
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Título"
              placeholder="Ej. Alisado"
              required
              {...form.getInputProps("title")}
            />

            <Textarea
              label="Descripción"
              placeholder="Detalles del trabajo..."
              autosize
              minRows={3}
              {...form.getInputProps("description")}
            />

            <NumberInput
              label="Precio"
              placeholder="0"
              required
              min={0}
              prefix="$"
              thousandSeparator
              {...form.getInputProps("price")}
            />

            {error && (
              <Paper p="xs" bg="red.0" withBorder>
                <Title order={6} c="red">
                  Error
                </Title>
                <Title order={6} fw={400} c="red">
                  {error}
                </Title>
              </Paper>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                {initialData ? "Actualizar" : "Guardar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
