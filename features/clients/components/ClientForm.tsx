"use client";

import { useState } from "react";
import { Button, Group, Stack, TextInput, Title, Paper } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Client } from "../types/clients.type";
import { createClient, updateClient } from "../services/clients.service";

interface ClientFormProps {
  initialData?: Client | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ClientForm({
  initialData,
  onSuccess,
  onCancel,
}: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
    },

    validate: {
      name: (value) => (value.length < 2 ? "El nombre es obligatorio" : null),
      /* email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"), */
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      if (initialData?.id) {
        const { error: updateError } = await updateClient(
          initialData.id,
          values,
        );
        if (updateError) throw updateError;
      } else {
        const { error: createError } = await createClient(values);
        if (createError) throw createError;
      }

      form.reset();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" withBorder radius="md">
      <Stack gap="md">
        <Title order={3}>
          {initialData ? "Editar Cliente" : "Nuevo Cliente"}
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Nombre"
              placeholder="Nombre del cliente"
              required
              {...form.getInputProps("name")}
            />

            <TextInput
              label="Email"
              placeholder="ejemplo@correo.com"
              {...form.getInputProps("email")}
            />

            <TextInput
              label="Teléfono"
              placeholder="+56 9 ..."
              required
              {...form.getInputProps("phone")}
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
