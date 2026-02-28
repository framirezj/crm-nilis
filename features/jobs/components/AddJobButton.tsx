"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import JobForm from "./JobForm";
import { useRouter } from "next/navigation";

interface AddJobButtonProps {
  clientId: string;
}

export default function AddJobButton({ clientId }: AddJobButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const handleSuccess = () => {
    close();
    router.refresh();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Registrar Trabajo" centered>
        <JobForm
          clientId={clientId}
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
