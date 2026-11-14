import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ParentPage from '@/app/parent/page';

const meta = {
  title: 'parent/ParentPage',
  component: ParentPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ParentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>Parent content</div>,
  },
};
