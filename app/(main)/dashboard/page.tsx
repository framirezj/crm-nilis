import { Title, Text } from "@mantine/core";

export default function DashboardPage() {
  return (
    <div>
      <Title order={2} mb="md">
        Dashboard
      </Title>
      <Text c="dimmed">¡Bienvenido! Has iniciado sesión correctamente.</Text>
    </div>
  );
}
