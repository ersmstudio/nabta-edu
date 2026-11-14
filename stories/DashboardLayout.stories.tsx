import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DashboardLayout from '../app/Dashboardlayout';

const meta = {
  title: 'Dashboard/DashboardLayout',
  component: DashboardLayout,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>Dashboard content</div>,
  },
};
