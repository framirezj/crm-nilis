"use client";

import { useState } from "react";
import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Text,
  ActionIcon,
  Divider,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { createJob, updateJob } from "../services/jobs.service";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import type { Job, JobServicio, JobServicioForm } from "../types/jobs.type";
import type { Servicio } from "@/features/servicios/types/servicios.types";

interface JobFormProps {
  initialData?: Job | null;
  /** Servicios ya guardados en job_servicios (solo para editar) */
  initialServicios?: JobServicio[];
  /** Catálogo completo de servicios para el Select */
  catalogoServicios: Servicio[];
  clientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function emptyServicioRow(): JobServicioForm {
  return { servicio_id: null, nombre: "", precio: "" };
}

export default function JobForm({
  initialData,
  initialServicios = [],
  catalogoServicios = [],
  clientId,
  onSuccess,
  onCancel,
}: JobFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  // Estado local de los servicios seleccionados
  const [servicios, setServicios] = useState<JobServicioForm[]>(() => {
    if (initialServicios.length > 0) {
      return initialServicios.map((s) => ({
        servicio_id: s.servicio_id,
        nombre: s.servicio ?? "",
        precio: s.precio,
      }));
    }
    return [emptyServicioRow()];
  });

  const form = useForm({
    initialValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      date: initialData?.date ?? new Date().toISOString().split("T")[0],
    },
    validate: {
      title: (v) => (v.trim().length < 2 ? "El título es obligatorio" : null),
      date: (v) => (!v ? "La fecha es obligatoria" : null),
    },
  });

  // Opciones para el Select del catálogo — formato agrupado de Mantine v7
  const selectData = (() => {
    const groups: Record<string, { value: string; label: string }[]> = {};
    for (const s of catalogoServicios) {
      const cat = s.categoria ?? "Sin categoría";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ value: String(s.id), label: s.servicio });
    }
    return Object.entries(groups).map(([group, items]) => ({ group, items }));
  })();

  const addRow = () => setServicios((prev) => [...prev, emptyServicioRow()]);

  const removeRow = (index: number) =>
    setServicios((prev) => prev.filter((_, i) => i !== index));

  const updateRow = (index: number, patch: Partial<JobServicioForm>) =>
    setServicios((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );

  const handleSelectServicio = (index: number, value: string | null) => {
    if (!value) return;
    const found = catalogoServicios.find((s) => String(s.id) === value);
    updateRow(index, {
      servicio_id: found ? found.id : null,
      nombre: found?.servicio ?? "",
    });
  };

  const total = servicios.reduce((sum, s) => sum + (Number(s.precio) || 0), 0);

  const validateServicios = (): string | null => {
    if (servicios.length === 0) return "Agregá al menos un servicio";
    for (const s of servicios) {
      if (!s.servicio_id) return "Seleccioná un servicio en cada fila";
      if (Number(s.precio) <= 0) return "El precio de cada servicio debe ser mayor a 0";
    }
    return null;
  };

  const handleSubmit = async (values: typeof form.values) => {
    const serviciosError = validateServicios();
    if (serviciosError) {
      setError(serviciosError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        client_id: clientId,
        title: values.title,
        description: values.description,
        date: values.date,
        servicios,
      };

      if (initialData?.id) {
        const { error: e } = await updateJob(supabase, initialData.id, payload);
        if (e) throw e;
      } else {
        const { error: e } = await createJob(supabase, payload);
        if (e) throw e;
      }

      form.reset();
      setServicios([emptyServicioRow()]);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar el trabajo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        {/* Datos generales */}
        <TextInput
          label="Título"
          placeholder="Ej. Alisado + corte"
          required
          {...form.getInputProps("title")}
        />

        <Textarea
          label="Notas"
          placeholder="Observaciones del trabajo..."
          autosize
          minRows={2}
          {...form.getInputProps("description")}
        />

        <TextInput
          label="Fecha"
          type="date"
          required
          {...form.getInputProps("date")}
        />

        <Divider label="Servicios realizados" labelPosition="left" mt="xs" />

        {/* Filas de servicios */}
        <Stack gap="xs">
          {servicios.map((row, index) => (
            <Group key={index} gap="xs" align="flex-end">
              <Select
                placeholder="Seleccionar servicio"
                data={selectData}
                value={row.servicio_id ? String(row.servicio_id) : null}
                onChange={(v) => handleSelectServicio(index, v)}
                searchable
                style={{ flex: 2 }}
              />
              <NumberInput
                placeholder="Precio"
                value={row.precio}
                onChange={(v) => updateRow(index, { precio: v })}
                min={0}
                prefix="$"
                thousandSeparator
                style={{ flex: 1 }}
              />
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => removeRow(index)}
                disabled={servicios.length === 1}
                mb={1}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>

        <Button
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={addRow}
          size="xs"
          w="fit-content"
        >
          Agregar servicio
        </Button>

        {/* Total */}
        <Paper withBorder p="sm" radius="md" bg="gray.0">
          <Group justify="space-between">
            <Text fw={600} size="sm">Total</Text>
            <Text fw={700} c="blue.7">
              {new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
                maximumFractionDigits: 0,
              }).format(total)}
            </Text>
          </Group>
        </Paper>

        {error && (
          <Text size="sm" c="red">
            {error}
          </Text>
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
  );
}
