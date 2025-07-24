import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// 1. Create a reusable "Toast" configuration
const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end', // Position it in the top-right corner
  showConfirmButton: false,
  timer: 1000, // Auto-close after 3 seconds
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

// 2. Update the alert functions to use the new Toast config
export const showSuccessAlert = (title) => {
  Toast.fire({
    icon: 'success',
    title: title,
  });
};

export const showErrorAlert = (title) => {
  Toast.fire({
    icon: 'error',
    title: title,
  });
};

// 3. The confirmation dialog remains a large, centered modal, which is correct.
export const showConfirmDialog = ({ title, text }) =>
  MySwal.fire({
    title: `<p>${title}</p>`,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, do it!',
    customClass: {
      confirmButton: 'cursor-pointer',
      cancelButton: 'cursor-pointer',
    },
  });
