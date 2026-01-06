/**
 * Modal de partage de session
 * Affiche le code et le lien de partage avec bouton de copie
 */

import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './style.scss';

interface ShareSessionModalProps {
  shareCode: string;
  shareLink: string;
  onClose: () => void;
}

const ShareSessionModal: React.FC<ShareSessionModalProps> = ({
  shareCode,
  shareLink,
  onClose,
}) => {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  /**
   * Copie le code dans le presse-papier
   */
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  /**
   * Copie le lien dans le presse-papier
   */
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          className="share-modal__close"
          onClick={onClose}
        >
          <X size={24} />
        </Button>

        <div className="share-modal__header">
          <h2>Session Créée !</h2>
          <p>Partagez ce code ou ce lien avec vos participants</p>
        </div>

        <div className="share-modal__content">
          {/* Code de session */}
          <div className="share-section">
            <label>Code de Session</label>
            <div className="share-code">
              <span className="share-code__value">{shareCode}</span>
              <Button
                variant="ghost"
                size="icon"
                className={`share-code__copy ${codeCopied ? 'copied' : ''}`}
                onClick={copyCode}
              >
                {codeCopied ? <Check size={20} /> : <Copy size={20} />}
              </Button>
            </div>
            <p className="share-hint">
              Les participants peuvent rejoindre avec ce code
            </p>
          </div>

          {/* Lien de partage */}
          <div className="share-section">
            <label>Lien de Partage</label>
            <div className="share-link">
              <input
                type="text"
                value={shareLink}
                readOnly
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant="ghost"
                size="icon"
                className={`share-link__copy ${linkCopied ? 'copied' : ''}`}
                onClick={copyLink}
              >
                {linkCopied ? <Check size={20} /> : <Copy size={20} />}
              </Button>
            </div>
            <p className="share-hint">
              Ou partagez directement ce lien
            </p>
          </div>
        </div>

        <div className="share-modal__footer">
          <Button onClick={onClose}>
            Aller à la Salle d'Attente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareSessionModal;
