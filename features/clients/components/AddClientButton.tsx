"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ClientForm from "./ClientForm";
import { useRouter } from "next/navigation";

export default function AddClientButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const handleSuccess = () => {
    close();
    router.refresh();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Registrar Cliente" centered>
        <ClientForm onSuccess={handleSuccess} onCancel={close} />
      </Modal>

      <Button leftSection={<IconPlus size={16} />} onClick={open}>
        Nuevo cliente
      </Button>
    </>
  );
}
