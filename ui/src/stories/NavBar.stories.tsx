import type { Meta, StoryObj } from '@storybook/react';
import NavBar from '../components/NavBar/NavBar';

const meta: Meta<typeof NavBar> = {
  title: 'NavBar',
  component: NavBar,
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Normal: Story = {};
