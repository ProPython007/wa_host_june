import React, { useContext, useEffect, useState } from "react";
import { GlobalVariablesContext } from "../../../GlobalVariables";

function OpenDialogBox({ setIsDialogOpen }) {
  // const [isSwitch, setIsSwitch] = useState(false);
  const { userData2 } = useContext(GlobalVariablesContext);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // return (
  //   <div className="dialog-overlay">
  //     <div className="dialog-content">
  //       <button className="close-button" onClick={closeDialog}>
  //         Close
  //       </button>
  //       {isSwitch ? (
  //         <div className="mainContent1">
  //           <button
  //             className="close-button"
  //             onClick={() => {
  //               setIsSwitch(!isSwitch);
  //             }}
  //           >
  //             Switch to LED Shoes
  //           </button>
  //           <h1>AMDESI</h1>
  //           {userData ? (
  //             <div>
  //               {/* User Details Table */}
  //               <table className="user-details-table">
  //                 <thead>
  //                   <tr>
  //                     <th>Field Name</th>
  //                     <th>Value</th>
  //                   </tr>
  //                 </thead>

  //                 <tbody>
  //                   {Object.entries(userData).map(
  //                     ([fieldName, value]) =>
  //                       fieldName !== "orders" && (
  //                         <tr key={fieldName}>
  //                           <td>{fieldName}</td>
  //                           <td>
  //                             {fieldName === "full_address" ? (
  //                               <div>
  //                                 <div>
  //                                   <strong>Address:</strong> {value.address}
  //                                 </div>
  //                                 <div>
  //                                   <strong>Pincode:</strong> {value.pincode}
  //                                 </div>
  //                                 <div>
  //                                   <strong>City:</strong> {value.city}
  //                                 </div>
  //                                 <div>
  //                                   <strong>State:</strong> {value.state}
  //                                 </div>
  //                               </div>
  //                             ) : typeof value === "object" ? (
  //                               JSON.stringify(value)
  //                             ) : (
  //                               value
  //                             )}
  //                           </td>
  //                         </tr>
  //                       )
  //                   )}
  //                 </tbody>
  //               </table>

  //               {/* Orders Table */}
  //               {Object.keys(userData.orders[0]).map((titleColumn) =>
  //                 titleColumn != "products" ? (
  //                   <tr key={titleColumn}>
  //                     <th>{titleColumn}</th>
  //                     <td>
  //                       {userData.orders.map((order) => (
  //                         <div key={order.order_id}>
  //                           {order[titleColumn] ? (
  //                             <p className="Value-CopyBtn">
  //                               {String(order[titleColumn])}
  //                               <span
  //                                 onClick={() =>
  //                                   navigator.clipboard.writeText(
  //                                     String(order[titleColumn])
  //                                   )
  //                                 }
  //                               >
  //                                 C
  //                               </span>
  //                             </p>
  //                           ) : (
  //                             ""
  //                           )}
  //                         </div>
  //                       ))}
  //                     </td>
  //                   </tr>
  //                 ) : (
  //                   ["model", "price", "size"].map((productTitle) => (
  //                     <tr key={productTitle}>
  //                       <th>{productTitle}</th>
  //                       <td>
  //                         {productTitle != "size"
  //                           ? userData.orders.map((order) => (
  //                               <div key={order.order_id}>
  //                                 {order.products[0][productTitle] ? (
  //                                   <p className="Value-CopyBtn">
  //                                     {String(order.products[0][productTitle])}
  //                                     <span
  //                                       onClick={() =>
  //                                         navigator.clipboard.writeText(
  //                                           String(
  //                                             order.products[0][productTitle]
  //                                           )
  //                                         )
  //                                       }
  //                                     >
  //                                       C
  //                                     </span>
  //                                   </p>
  //                                 ) : (
  //                                   ""
  //                                 )}
  //                               </div>
  //                             ))
  //                           : userData.orders.map((order) => (
  //                               <div key={order.order_id}>
  //                                 {order.products[0].options[0][
  //                                   productTitle
  //                                 ] ? (
  //                                   <p className="Value-CopyBtn">
  //                                     {String(
  //                                       order.products[0].options[0][
  //                                         productTitle
  //                                       ]
  //                                     )}
  //                                     <span
  //                                       onClick={() =>
  //                                         navigator.clipboard.writeText(
  //                                           String(
  //                                             order.products[0].options[0][
  //                                               productTitle
  //                                             ]
  //                                           )
  //                                         )
  //                                       }
  //                                     >
  //                                       C
  //                                     </span>
  //                                   </p>
  //                                 ) : (
  //                                   ""
  //                                 )}
  //                               </div>
  //                             ))}
  //                       </td>
  //                     </tr>
  //                   ))
  //                 )
  //               )}
  //             </div>
  //           ) : (
  //             <p>No data found</p>
  //           )}
  //         </div>
  //       ) : (
  //         <div className="mainContent2">
  //           <button
  //             className="close-button"
  //             onClick={() => {
  //               setIsSwitch(!isSwitch);
  //             }}
  //           >
  //             Switch to Amdesi
  //           </button>
  //           <h1>LED SHOE</h1>
  //           {userData2 ? (
  //             <div>
  //               {/* User Details Table */}
  //               <table className="user-details-table">
  //                 <tbody>
  //                   <tr>
  //                     <th>Field Name</th>
  //                     <th>Value</th>
  //                   </tr>
  //                   {Object.keys(userData2.orders[0]).map((titleColumn) =>
  //                     titleColumn != "products" ? (
  //                       <tr key={titleColumn}>
  //                         <th>{titleColumn}</th>
  //                         <td>
  //                           {userData2.orders.map((order) => (
  //                             <div key={order.order_id}>
  //                               {order[titleColumn] ? (
  //                                 <p className="Value-CopyBtn">
  //                                   {String(order[titleColumn])}
  //                                   <span
  //                                     onClick={() =>
  //                                       navigator.clipboard.writeText(
  //                                         String(order[titleColumn])
  //                                       )
  //                                     }
  //                                   >
  //                                     C
  //                                   </span>
  //                                 </p>
  //                               ) : (
  //                                 ""
  //                               )}
  //                             </div>
  //                           ))}
  //                         </td>
  //                       </tr>
  //                     ) : (
  //                       ["model", "price", "options"].map((productTitle) => (
  //                         <tr key={productTitle}>
  //                           <th>
  //                             {productTitle === "options"
  //                               ? "options (size)"
  //                               : productTitle}
  //                           </th>
  //                           <td>
  //                             {productTitle != "options"
  //                               ? userData2.orders.map((order) => (
  //                                   <div key={order.order_id}>
  //                                     {order?.products[0][productTitle] ? (
  //                                       <p className="Value-CopyBtn">
  //                                         {String(
  //                                           order?.products[0][productTitle]
  //                                         )}
  //                                         <span
  //                                           onClick={() =>
  //                                             navigator?.clipboard?.writeText(
  //                                               String(
  //                                                 order?.products[0][
  //                                                   productTitle
  //                                                 ]
  //                                               )
  //                                             )
  //                                           }
  //                                         >
  //                                           C
  //                                         </span>
  //                                       </p>
  //                                     ) : (
  //                                       ""
  //                                     )}
  //                                   </div>
  //                                 ))
  //                               : userData2.orders.map((order) => (
  //                                   <div key={order.order_id}>
  //                                     {order.products[0].options[0]?.size ? (
  //                                       <p className="Value-CopyBtn">
  //                                         {String(
  //                                           order.products[0].options[0]?.size
  //                                         )}
  //                                         <span
  //                                           onClick={() =>
  //                                             navigator.clipboard.writeText(
  //                                               String(
  //                                                 order.products[0].options[0]
  //                                                   ?.size
  //                                               )
  //                                             )
  //                                           }
  //                                         >
  //                                           C
  //                                         </span>
  //                                       </p>
  //                                     ) : (
  //                                       ""
  //                                     )}
  //                                   </div>
  //                                 ))}
  //                           </td>
  //                         </tr>
  //                       ))
  //                     )
  //                   )}
  //                 </tbody>
  //               </table>
  //             </div>
  //           ) : (
  //           <p>No data found</p>
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <button className="close-button" onClick={closeDialog}>
          Close
        </button>
        <div className="mainContent2">
          {/* <button
            className="close-button"
            onClick={() => {
              setIsSwitch(!isSwitch);
            }}
          >
            Switch to Amdesi
          </button> */}
          <h1>LED SHOE</h1>
          {userData2 ? (
            <div>
              {/* User Details Table */}
              <table className="user-details-table">
                <tbody>
                  <tr>
                    <th>Field Name</th>
                    <th>Value</th>
                  </tr>
                  {Object.keys(userData2.orders[0]).map((titleColumn) =>
                    titleColumn != "products" ? (
                      <tr key={titleColumn}>
                        <th>{titleColumn}</th>
                        <td>
                          {userData2.orders.map((order) => (
                            <div key={order.order_id}>
                              {order[titleColumn] ? (
                                <p className="Value-CopyBtn">
                                  {String(order[titleColumn])}
                                  <span
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        String(order[titleColumn])
                                      )
                                    }
                                  >
                                    C
                                  </span>
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ) : (
                      ["model", "price", "options"].map((productTitle) => (
                        <tr key={productTitle}>
                          <th>
                            {productTitle === "options"
                              ? "options (size)"
                              : productTitle}
                          </th>
                          <td>
                            {productTitle != "options"
                              ? userData2.orders.map((order) => (
                                  <div key={order.order_id}>
                                    {order?.products[0][productTitle] ? (
                                      <p className="Value-CopyBtn">
                                        {String(
                                          order?.products[0][productTitle]
                                        )}
                                        <span
                                          onClick={() =>
                                            navigator?.clipboard?.writeText(
                                              String(
                                                order?.products[0][productTitle]
                                              )
                                            )
                                          }
                                        >
                                          C
                                        </span>
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                ))
                              : userData2.orders.map((order) => (
                                  <div key={order.order_id}>
                                    {order.products[0].options[0]?.size ? (
                                      <p className="Value-CopyBtn">
                                        {String(
                                          order.products[0].options[0]?.size
                                        )}
                                        <span
                                          onClick={() =>
                                            navigator.clipboard.writeText(
                                              String(
                                                order.products[0].options[0]
                                                  ?.size
                                              )
                                            )
                                          }
                                        >
                                          C
                                        </span>
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                ))}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No data found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OpenDialogBox;
