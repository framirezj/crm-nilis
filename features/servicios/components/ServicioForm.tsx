"use client";

import { useState } from "react";
import {
  Button,
  Group,
  Stack,
  TextInput,
  Combobox,
  InputBase,
  useCombobox,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import {
  createServicio,
  updateServicio,
} from "../services/servicios.service";
import type { Servicio, ServicioFormValues } from "../types/servicios.types";

interface ServicioFormProps {
  initialData?: Servicio | null;
  /** Categorías existentes para el Combobox */
  categorias: string[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ServicioForm({
  initialData,
  categorias,
  onSuccess,
  onCancel,
}: ServicioFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  const form = useForm<ServicioFormValues>({
    initialValues: {
      servicio: initialData?.servicio ?? "",
      categoria: initialData?.categoria ?? "",
    },
    validate: {
      servicio: (v) => (v.trim().length < 2 ? "El nombre es obligatorio" : null),
      categoria: (v) => (v.trim().length < 1 ? "La categoría es obligatoria" : null),
    },
  });

  // --- Combobox creatable para categoría ---
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [catSearch, setCatSearch] = useState(initialData?.categoria ?? "");

  const filteredCats = categorias.filter((c) =>
    c.toLowerCase().includes(catSearch.toLowerCase().trim())
  );
  const exactMatch = categorias.some(
    (c) => c.toLowerCase() === catSearch.toLowerCase().trim()
  );

  const handleCatSelect = (val: string) => {
    const finalVal = val === "$create" ? catSearch.trim() : val;
    form.setFieldValue("categoria", finalVal);
    setCatSearch(finalVal);
    combobox.closeDropdown();
  };

  // --- Submit ---
  const handleSubmit = async (values: ServicioFormValues) => {
    setLoading(true);
    setError(null);
    try {
      if (initialData?.id) {
        await updateServicio(supabase, initialData.id, values);
      } else {
        await createServicio(supabase, values);
      }
      form.reset();
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <TextInput
          label="Servicio"
          placeholder="Ej: Corte de cabello"
          required
          {...form.getInputProps("servicio")}
        />

        {/* Combobox creatable — categoría */}
        <Combobox store={combobox} onOptionSubmit={handleCatSelect} withinPortal>
          <Combobox.Target>
            <InputBase
              label="Categoría"
              required
              placeholder="Selecciona o escribe una categoría"
              rightSection={<Combobox.Chevron />}
              rightSectionPointerEvents="none"
              value={catSearch}
              error={form.errors.categoria}
              onChange={(e) => {
                combobox.openDropdown();
                combobox.updateSelectedOptionIndex();
                setCatSearch(e.currentTarget.value);
                form.setFieldValue("categoria", e.currentTarget.value);
              }}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => combobox.closeDropdown()}
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {filteredCats.map((cat) => (
                <Combobox.Option key={cat} value={cat}>
                  {cat}
                </Combobox.Option>
              ))}
              {!exactMatch && catSearch.trim().length > 0 && (
                <Combobox.Option value="$create">
                  + Crear &quot;{catSearch.trim()}&quot;
                </Combobox.Option>
              )}
              {filteredCats.length === 0 && catSearch.trim().length === 0 && (
                <Combobox.Empty>Sin categorías aún</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

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
