// import { useEffect, useState } from 'react';
// import { useLang } from '../../../hooks/useLang';
// import axiosInstance from '../../../service/instance';
// import PopupMessage from '../../common/atoms/PopupMessage';
// import { RxCross2 } from 'react-icons/rx';
// import { useNavigate } from 'react-router-dom';

// // interface DecodedToken {
// //   id: string;
// //   email: string;
// // }

// const VerifyAccount = () => {
//   //   const { lang } = useLang();

//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [verify, setVerify] = useState(false);
//   //   const [decoded, setDecoded] = useState<DecodedToken | null>(null);
//   const navigate = useNavigate();

//   //   useEffect(() => {
//   //     const token = sessionStorage.getItem('accessToken');

//   //     if (token) {
//   //       try {
//   //         const decoded = jwtDecode<DecodedToken>(token);
//   //         setDecoded(decoded);
//   //       } catch (error) {
//   //         console.error('Failed to decode token', error);
//   //       }
//   //     } else {
//   //       console.error('No token found in sessionStorage');
//   //     }
//   //   }, []);
//   //   const onSubmit = async (data: FormData) => {
//   //     try {
//   //       const formData = new FormData();
//   //       formData.append('otp', data.otp);

//   //       const res = await axiosInstance.post('user/verifyOTP', formData, {
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //         },
//   //       });

//   //       setSuccess(res?.data?.message);
//   //       setError('');
//   //       setVerify(true);
//   //     } catch (error) {
//   //       if (axios.isAxiosError(error)) {
//   //         setError(error.response?.data?.message || 'An error occurred');
//   //         setSuccess('');
//   //       } else {
//   //         setError('Email or OTP is incorrect');
//   //       }
//   //     }
//   //   };

//   const handleDeleteClick = async () => {
//     try {
//       const response = await axiosInstance.patch(`/user/delete`);
//       console.log(response);
//     } catch (error) {}
//   };
//   const handleCloseDelete = () => {
//     setVerify(false);
//   };

//   return (
//     <div className="w-full max-w-md  p-6 rounded-lg ">
//       {error && <PopupMessage message={error} setMessage={setError} type="error" />}
//       {success && <PopupMessage message={success} setMessage={setSuccess} type="success" />}

//       {/* {!verify && (
//         <for{m onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="grid grid-cols-1 gap-4">
//             <Label name="otp" label={authLabel.EnterOTP[lang]} />
//             <input
//               {...register('otp', { required: true })}
//               placeholder={authLabel.EnterOTP[lang]}
//               type="number"
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="flex justify-end mt-4">
//             <Button
//               buttonText={authLabel.verify[lang]}
//               type="submit"
//               name=""
//               disabled={isSubmitting}
//               className="w-full lg:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </form>
//       )} */}

//       {verify && (
//         <div>
//           <div className="fixed inset-0 w-[100%] flex items-center justify-center font-poppins bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded shadow-lg w-96">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-bold">Delete Account</h2>
//                 <button onClick={handleCloseDelete} className="text-gray-500">
//                   <RxCross2 />
//                 </button>
//               </div>
//               <p className="mb-4">Are you sure you want to Logout? </p>
//               <div className="flex justify-end gap-4">
//                 <button
//                   name="Cancel"
//                   type="button"
//                   onClick={handleCloseDelete}
//                   className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   name="Confirm"
//                   type="button"
//                   onClick={handleDeleteClick}
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VerifyAccount;
