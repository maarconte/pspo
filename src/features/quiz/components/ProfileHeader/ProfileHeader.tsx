import React, { FC, useState, useTransition } from "react";
import { User } from "firebase/auth";
import { Edit2, Check, X, User as UserIcon } from "lucide-react";
import { updateUserDisplayName } from "../../../../lib/firebase/auth";
import { useUserStore } from "../../../../stores/useUserStore";
import { toast } from "react-toastify";
import "./ProfileHeader.scss";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user }) => {
  const setUser = useUserStore((s) => s.setUser);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.displayName || "");
  const [isPending, startTransition] = useTransition();

  const handleEdit = () => {
    setNewName(user.displayName || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(user.displayName || "");
  };

  const handleSave = () => {
    if (!newName.trim() || newName.trim() === user.displayName) {
      setIsEditing(false);
      return;
    }

    if (newName.length < 3 || newName.length > 30) {
      toast.error("Username must be between 3 and 30 characters");
      return;
    }

    startTransition(async () => {
      try {
        const updatedUser = await updateUserDisplayName(newName.trim());
        setUser({ ...updatedUser } as User); // Force dynamic update
        toast.success("Username updated");
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating username:", error);
        toast.error("Failed to update username");
      }
    });
  };

  return (
    <div className="ProfileHeader d-flex align-items-center gap-3 mb-4">
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile pic"
          referrerPolicy="no-referrer"
          className="rounded-circle shadow-sm"
          width={72}
          height={72}
        />
      ) : (
        <div className="user-avatar shadow-sm">
          {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || <UserIcon size={32} />}
        </div>
      )}
      
      <div className="flex-grow-1">
        <div className="d-flex align-items-center gap-2">
          {isEditing ? (
            <div className="d-flex align-items-center gap-2 w-100 max-w-sm">
              <input
                type="text"
                className="form-control form-control-lg name-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                disabled={isPending}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <button 
                className="btn btn-success btn-icon shadow-sm" 
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? <div className="spinner-border spinner-border-sm" /> : <Check size={18} />}
              </button>
              <button 
                className="btn btn-outline-secondary btn-icon shadow-sm" 
                onClick={handleCancel}
                disabled={isPending}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <h1 className="h3 mb-0 fw-bold text-gradient">
                {user.displayName || user.email?.split('@')[0]}
              </h1>
              <button 
                className="btn btn-link text-muted p-1 edit-btn" 
                onClick={handleEdit}
                title="Edit name"
              >
                <Edit2 size={16} />
              </button>
            </>
          )}
        </div>
        <p className="text-muted mb-0 d-flex align-items-center gap-1">
          {user.email} • Statistics and progress
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
