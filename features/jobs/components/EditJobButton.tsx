"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import JobForm from "./JobForm";
import { useRouter } from "next/navigation";
import { Job } from "../types/jobs.type";

interface EditJobButtonProps {
  job: Job;
}

export default function EditJobButton({ job }: EditJobButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const handleSuccess = () => {
    close();
    router.refresh();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Editar Trabajo" centered>
        <JobForm
          initialData={job}
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
