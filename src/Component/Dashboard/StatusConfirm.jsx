import { useState } from 'react';
import Swal from 'sweetalert2';

export const useConfirm = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [callback, setCallback] = useState(null);

    const confirm = (callbackFn, message = "Are you sure?") => {
        setCallback(() => callbackFn);
        setIsConfirming(true);
        
        Swal.fire({
            title: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                callbackFn();
            }
            setIsConfirming(false); 
        });
    };

    return confirm; 
};
