import { useState, FormEvent } from 'react';
import { useUserStore } from '../features/auth/stores/useAuthStore';
import { Button } from '../ui';
import { toast } from 'react-toastify';
import { User } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateDisplayName } = useUserStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      toast.error('Le nom d\'affichage ne peut pas être vide');
      return;
    }

    setIsUpdating(true);
    try {
      await updateDisplayName(displayName.trim());
      toast.success('Nom d\'affichage mis à jour avec succès !');
    } catch (error: any) {
      console.error('Error updating display name:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du nom d\'affichage');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Mon Profil</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* User Avatar and Info */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-2xl font-bold">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User size={32} />}
            </div>
            <div>
              <h2 className="text-2xl font-semibold m-0">{user.displayName || 'Utilisateur'}</h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>

          {/* Update Display Name Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="displayName"
                className="block mb-2 font-medium text-gray-700"
              >
                Nom d'affichage
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Entrez votre nom d'affichage"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isUpdating}
              />
            </div>

            <Button
              disabled={isUpdating || !displayName.trim() || displayName === user.displayName}
              className="d-block w-100">{isUpdating ? 'Mise à jour...' : 'Mettre à jour'}</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
