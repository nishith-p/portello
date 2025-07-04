'use client';

import { useState } from 'react';
import { Button, Modal, TextInput, Select, MultiSelect } from '@mantine/core';
import { useAgenda } from '@/lib/agenda/hooks';
import { Session } from '@/lib/agenda/types';

const AdminAgendaPanel = () => {
  const { days, updateSession } = useAgenda();
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activityTypes = [
    'keynote', 'workshop', 'panel', 'break', 'networking', 
    'special event', 'plenary', 'pai election', 'wll', 'a2030', 'ysf', 'default'
  ];

  const handleSave = async () => {
    if (!editingSession) return;
    
    try {
      await updateSession(editingSession.id, {
        title: editingSession.title,
        start_time: editingSession.start_time,
        end_time: editingSession.end_time,
        type: editingSession.type,
        show_badges: editingSession.show_badges
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Add Session</Button>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Session"
      >
        {editingSession && (
          <>
            <TextInput
              label="Title"
              value={editingSession.title}
              onChange={(e) => setEditingSession({...editingSession, title: e.target.value})}
            />
            <TextInput
              label="Start Time"
              value={editingSession.start_time}
              onChange={(e) => setEditingSession({...editingSession, start_time: e.target.value})}
            />
            <TextInput
              label="End Time"
              value={editingSession.end_time}
              onChange={(e) => setEditingSession({...editingSession, end_time: e.target.value})}
            />
            <Select
              label="Activity Type"
              data={activityTypes}
              value={editingSession.type}
              onChange={(value) => setEditingSession({...editingSession, type: value || 'default'})}
            />
            <MultiSelect
              label="Target Roles"
              data={editingSession.targetRoles}
              value={editingSession.targetRoles}
              onChange={(values) => setEditingSession({...editingSession, targetRoles: values})}
            />
            <Button onClick={handleSave} mt="md">
              Save Changes
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminAgendaPanel;
