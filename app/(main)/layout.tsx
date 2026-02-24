"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  NavLink,
  Group,
  Title,
  Divider,
  Stack,
} from "@mantine/core";
import { IconHome, IconUsers, IconLogout } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Home", href: "/dashboard", icon: IconHome },
  { label: "Clientes", href: "/clients", icon: IconUsers },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [opened, { toggle, close }] = useDisclosure();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>CRM Nilis</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack justify="space-between" h="100%">
          <div>
            <Divider mb="sm" hiddenFrom="sm" />
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={pathname.startsWith(item.href)}
                variant="filled"
                onClick={close}
              />
            ))}
          </div>

          <NavLink
            label="Cerrar sesión"
            leftSection={<IconLogout size={20} stroke={1.5} />}
            onClick={handleLogout}
            color="red"
            variant="subtle"
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
