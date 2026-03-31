import { ModulePlaceholderPage } from '../components/ModulePlaceholderPage'

export function ProfilePage() {
  return (
    <ModulePlaceholderPage
      title="My Account"
      subtitle="Update your profile, credentials, and how we reach you. Additional preferences will roll out over time."
      items={[
        { label: 'My Info' },
        { label: 'Change Password' },
        { label: 'Contact Information' },
        { label: 'Emergency Contact', future: true },
        { label: 'Notification Settings', future: true },
      ]}
    />
  )
}
