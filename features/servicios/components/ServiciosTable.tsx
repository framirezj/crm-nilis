"use client";

import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  Chip,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  Title,
  VisuallyHidden,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { deleteServicio } from "../services/servicios.service";
import type { Servicio } from "../types/servicios.types";
import ServicioForm from "./ServicioForm";
import ServicioSearchBar from "./ServicioSearchBar";
import { useMemo } from "react";

interface ServiciosTableProps {
  data: Servicio[];
  categorias: string[];
}

/** Colores por categoría para los badges */
const CATEGORY_COLORS: Record<string, string> = {
  Coloración: "pink",
  Alisado: "violet",
  Corte: "blue",
  Tratamiento: "teal",
  Peinado: "orange",
};

function getCategoryColor(categoria: string) {
  return CATEGORY_COLORS[categoria] ?? "gray";
}

export default function ServiciosTable({
  data,
  categorias,
}: ServiciosTableProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();

  // Modal crear/editar
  const [formOpened, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);

  // Modal confirmar eliminación
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);

  const handleNew = () => {
    setEditingServicio(null);
    openForm();
  };

  const handleEdit = (servicio: Servicio) => {
    setEditingServicio(servicio);
    openForm();
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    openDelete();
  };

  const handleDeleteConfirm = async () => {
    if (deletingId === null) return;
    setDeleteLoading(true);
    try {
      await deleteServicio(supabase, deletingId);
      closeDelete();
      setDeletingId(null);
      router.refresh();
    } catch {
      // silently ignore, could show a notification
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    closeForm();
    setEditingServicio(null);
    router.refresh();
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.servicio
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchCategoria = selectedCategoria
        ? item.categoria === selectedCategoria
        : true;
      return matchSearch && matchCategoria;
    });
  }, [data, search, selectedCategoria]);

  const emptyState = (
    <Center py="xl">
      <Text c="dimmed" fz="sm">
        No hay servicios registrados
      </Text>
    </Center>
  );

  // --- Vista desktop: tabla ---
  const rows = filteredData.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm" fw={500}>
          {item.servicio}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="light"
          color={getCategoryColor(item.categoria)}
          size="sm"
        >
          {item.categoria}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={4} justify="flex-end">
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Editar"
            onClick={() => handleEdit(item)}
          >
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            aria-label="Eliminar"
            onClick={() => handleDeleteClick(item.id)}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  // --- Vista mobile: cards ---
  const cards = filteredData.map((item) => (
    <Card key={item.id} withBorder padding="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text fz="sm" fw={500}>
            {item.servicio}
          </Text>
          <Badge
            variant="light"
            color={getCategoryColor(item.categoria)}
            size="sm"
            mt={4}
          >
            {item.categoria}
          </Badge>
        </div>
        <Group gap={4}>
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Editar"
            onClick={() => handleEdit(item)}
          >
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            aria-label="Eliminar"
            onClick={() => handleDeleteClick(item.id)}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  ));

  return (
    <>
      {/* Header */}
      <Group justify="space-between" mb="lg" px="lg">
        <Title order={2}>Servicios</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleNew}>
          Nuevo servicio
        </Button>
      </Group>

      <ServicioSearchBar
        value={search}
        onChange={(value) => setSearch(value)}
      />

      <Group px="lg" mb="sm" gap="xs">
        {categorias.map((cat) => (
          <Chip
            key={cat}
            value={cat}
            color={getCategoryColor(cat)}
            size="sm"
            checked={selectedCategoria === cat}
            onChange={() =>
              setSelectedCategoria(selectedCategoria === cat ? null : cat)
            }
          >
            {cat}
          </Chip>
        ))}
      </Group>

      {/* Desktop */}
      <Table.ScrollContainer minWidth={500} visibleFrom="sm">
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Servicio</Table.Th>
              <Table.Th>Categoría</Table.Th>
              <Table.Th>
                <VisuallyHidden>Acciones</VisuallyHidden>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={3}>{emptyState}</Table.Td>
              </Table.Tr>
            ) : (
              rows
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Mobile */}
      <Stack hiddenFrom="sm" gap="sm" px="lg">
        {filteredData.length === 0 ? emptyState : cards}
      </Stack>

      {/* Modal: crear / editar */}
      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editingServicio ? "Editar servicio" : "Nuevo servicio"}
        centered
      >
        <ServicioForm
          initialData={editingServicio}
          categorias={categorias}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
        />
      </Modal>

      {/* Modal: confirmar eliminación */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Eliminar servicio"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            ¿Estás seguro de que querés eliminar este servicio? Esta acción no
            se puede deshacer.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="subtle"
              onClick={closeDelete}
              disabled={deleteLoading}
            >
              Cancelar
            </Button>
            <Button
              color="red"
              loading={deleteLoading}
              onClick={handleDeleteConfirm}
            >
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
