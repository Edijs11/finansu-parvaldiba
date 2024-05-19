import { useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ onClose, children }: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.addEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-[400px]" ref={ref}>
        <div className="bg-slate-800 p-6 border rounded-md flex flex-col">
          <button onClick={onClose} className="place-self-end text-2xl">
            x
          </button>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
