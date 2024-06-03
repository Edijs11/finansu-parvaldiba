interface DeleteModalProps {
  id: number;
  confirmDelete: (id: number) => void;
  onClose: () => void;
}

const Modal = ({ onClose, id, confirmDelete }: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-[400px]">
        <div className="bg-slate-800 p-6 border rounded-md flex flex-col items-center">
          <button onClick={onClose} className="place-self-end text-2xl -mt-2">
            x
          </button>
          <h1 className="text-lg">Vai tiešām vēlies dzēst ierakstu?</h1>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => confirmDelete(id)}
              className="p-2 bg-green-500 hover:bg-green-600 rounded text-white w-[70px]"
            >
              Jā
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-red-500 hover:bg-red-600 rounded text-white w-[70px]"
            >
              Nē
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
