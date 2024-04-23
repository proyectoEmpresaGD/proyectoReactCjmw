// import React from 'react';

// const Modal = ({ isOpen, close, product }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={close}>
//       <div className="bg-white p-6 rounded-lg max-w-lg w-full m-4" onClick={e => e.stopPropagation()}>
//         <img src={product.UrlImageProdu} alt={product.NameProdu} className="w-full h-auto rounded-md mb-4"/>
//         <h2 className="text-lg font-semibold mb-2">{product.NameProdu}</h2>
//         <p className="mb-4">{product.DesProdu}</p>
//         <div className="flex justify-between">
//           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = product.purchaseUrl}>Dónde comprar</button>
//           <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={close}>Adquirir muestra</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Modal;