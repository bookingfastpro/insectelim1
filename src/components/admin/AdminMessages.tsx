import { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2, Phone, Calendar } from 'lucide-react';
import { supabase, ContactMessage } from '../../lib/supabase';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setMessages(data);
  };

  const toggleRead = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('contact_messages')
      .update({ read: !currentStatus })
      .eq('id', id);

    loadMessages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      await supabase.from('contact_messages').delete().eq('id', id);
      loadMessages();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Messages reçus</h2>
        <span className="text-gray-600">
          {messages.filter((m) => !m.read).length} non lus
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Aucun message reçu</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white border rounded-xl p-6 transition-shadow hover:shadow-md ${
                message.read ? 'border-gray-200' : 'border-[#27ae60] bg-green-50/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleRead(message.id!, message.read!)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {message.read ? (
                      <MailOpen size={20} className="text-gray-400" />
                    ) : (
                      <Mail size={20} className="text-[#27ae60]" />
                    )}
                  </button>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{message.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                      <a
                        href={`mailto:${message.email}`}
                        className="hover:text-[#27ae60] transition-colors"
                      >
                        {message.email}
                      </a>
                      {message.phone && (
                        <a
                          href={`tel:${message.phone}`}
                          className="flex items-center gap-1 hover:text-[#27ae60] transition-colors"
                        >
                          <Phone size={14} />
                          {message.phone}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar size={14} />
                      {formatDate(message.created_at!)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(message.id!)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
