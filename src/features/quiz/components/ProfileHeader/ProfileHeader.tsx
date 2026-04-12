import React, { FC, useState, useTransition } from "react";
import { User } from "firebase/auth";
import { Edit2, Check, X, User as UserIcon, Mail } from "lucide-react";
import { updateUserDisplayName, updateUserEmail } from "../../../../lib/firebase/auth";
import { useUserStore } from "../../../../stores/useUserStore";
import { toast } from "react-toastify";
import Button from "../../../../ui/Button";
import { Button_Style, Button_Type } from "../../../../ui/Button/Button.types";
import "./ProfileHeader.scss";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user }) => {
  const setUser = useUserStore((s) => s.setUser);

  // --- Name Editing State ---
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.displayName || "");

  // --- Email Editing State ---
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user.email || "");

  const [isPending, startTransition] = useTransition();

  // --- Handlers ---
  const handleEditName = () => {
    setNewName(user.displayName || "");
    setIsEditingName(true);
    setIsEditingEmail(false);
  };

  const handleEditEmail = () => {
    setNewEmail(user.email || "");
    setIsEditingEmail(true);
    setIsEditingName(false);
  };

  const handleCancel = () => {
    setIsEditingName(false);
    setIsEditingEmail(false);
    setNewName(user.displayName || "");
    setNewEmail(user.email || "");
  };

  const handleSaveName = () => {
    if (!newName.trim() || newName.trim() === user.displayName) {
      setIsEditingName(false);
      return;
    }

    if (newName.length < 3 || newName.length > 30) {
      toast.error("Username must be between 3 and 30 characters");
      return;
    }

    startTransition(async () => {
      try {
        const updatedUser = await updateUserDisplayName(newName.trim());
        setUser({ ...updatedUser } as User);
        toast.success("Username updated");
        setIsEditingName(false);
      } catch (error) {
        console.error("Error updating username:", error);
        toast.error("Failed to update username");
      }
    });
  };

  const handleSaveEmail = () => {
    if (!newEmail.trim() || newEmail.trim() === user.email) {
      setIsEditingEmail(false);
      return;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    startTransition(async () => {
      try {
        const updatedUser = await updateUserEmail(newEmail.trim());
        setUser({ ...updatedUser } as User);
        toast.success("Email address updated");
        setIsEditingEmail(false);
      } catch (error: any) {
        console.error("Error updating email:", error);
        if (error.code === 'auth/requires-recent-login') {
          toast.error("Sensitive operation. Please logout and login again to confirm your identity.");
        } else if (error.code === 'auth/email-already-in-use') {
          toast.error("This email is already associated with another account.");
        } else {
          toast.error("Failed to update email address");
        }
      }
    });
  };

  return (
    <div className="ProfileHeader d-flex align-items-center gap-2 mb-4">
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile pic"
          referrerPolicy="no-referrer"
          className="rounded-circle shadow-sm"
          width={80}
          height={80}
        />
      ) : (
        <div className="user-avatar shadow-sm">
          {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || <UserIcon size={32} />}
        </div>
      )}

      <div className="flex-grow-1">
        {/* --- Name Section --- */}
        <div className="d-flex align-items-center gap-2  mb-1">
          {isEditingName ? (
            <div className="d-flex align-items-center gap-1 w-100 max-w-sm">
              <input
                type="text"
                className="form-control name-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                disabled={isPending}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              />
              <Button
              className="edit-btn"
                isIconButton
                style={Button_Style.TONAL}
                type={Button_Type.PRIMARY}
                onClick={handleSaveName}
                disabled={isPending}
                isLoader={isPending}
                icon={<Check size={18} />}
              />
              <Button
              className="edit-btn"
                isIconButton
                style={Button_Style.TONAL}
                type={Button_Type.ERROR}
                onClick={handleCancel}
                disabled={isPending}
                icon={<X size={18} />}
              />
            </div>
          ) : (
            <>
              <h1 className="h3 mb-0 fw-bold">
                {user.displayName || user.email?.split('@')[0]}
              </h1>
              <Button
                className="edit-btn"
                isIconButton
                style={Button_Style.TONAL}
                type={Button_Type.PRIMARY}
                onClick={handleEditName}
                title="Edit name"
                icon={<Edit2 size={16} />}
              />
            </>
          )}
        </div>

        {/* --- Email Section --- */}
        <div className="d-flex align-items-center gap-2">
          {isEditingEmail ? (
            <div className="d-flex align-items-center gap-2 w-100 max-w-sm">
              <input
                type="email"
                className="form-control email-input"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoFocus
                disabled={isPending}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEmail()}
              />
              <Button
                isIconButton
                style={Button_Style.TONAL}
                type={Button_Type.PRIMARY}
                onClick={handleSaveEmail}
                disabled={isPending}
                isLoader={isPending}
                icon={<Check size={18} />}
              />
              <Button
                isIconButton
                style={Button_Style.TONAL}
                type={Button_Type.PRIMARY}
                onClick={handleCancel}
                disabled={isPending}
                icon={<X size={18} />}
              />
            </div>
          ) : (
            <>
              <p className="text-muted mb-0 d-flex align-items-center gap-1">
                <Mail size={14} /> {user.email}
              </p>
              <Button
                className="edit-btn"
                isIconButton
                style={Button_Style.TONAL}
                type={Button_Type.PRIMARY}
                onClick={handleEditEmail}
                title="Edit email"
                icon={<Edit2 size={14} />}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
