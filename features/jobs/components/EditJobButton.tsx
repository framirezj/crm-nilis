"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import JobForm from "./JobForm";
import { useRouter } from "next/navigation";
import type { Job, JobServicio } from "../types/jobs.type";
import type { Servicio } from "@/features/servicios/types/servicios.types";

interface EditJobButtonProps {
  job: Job;
  initialServicios: JobServicio[];
  catalogoServicios: Servicio[];
}

export default function EditJobButton({
  job,
  initialServicios,
  catalogoServicios,
}: EditJobButtonProps) {
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
        title="Editar Trabajo"
        centered
        size="lg"
      >
        <JobForm
          initialData={job}
          initialServicios={initialServicios}
          catalogoServicios={catalogoServicios}
          clientId={job.client_id}
          onSuccess={handleSuccess}
          onCancel={close}
        />
      </Modal>

      <Button
        leftSection={<IconEdit size={16} />}
        onClick={open}
        variant="light"
      >
        Editar
      </Button>
    </>
  );
}
