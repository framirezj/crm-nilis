"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import JobForm from "./JobForm";
import { useRouter } from "next/navigation";
import type { Servicio } from "@/features/servicios/types/servicios.types";

interface AddJobButtonProps {
  clientId: string;
  catalogoServicios: Servicio[];
}

export default function AddJobButton({
  clientId,
  catalogoServicios,
}: AddJobButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const handleSuccess = () => {
    close();
    router.refresh();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Registrar Trabajo"
        centered
        size="lg"
      >
        <JobForm
          clientId={clientId}
          catalogoServicios={catalogoServicios}
          onSuccess={handleSuccess}
          onCancel={close}
        />
      </Modal>

      <Button
        leftSection={<IconPlus size={16} />}
        onClick={open}
        variant="filled"
      >
        Nuevo Trabajo
      </Button>
    </>
  );
}
