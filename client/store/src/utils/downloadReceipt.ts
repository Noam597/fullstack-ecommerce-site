import axios from "axios";


export const downloadReceipt = async (  
    orderId: number,
    order_code: string  
) => {
const res = await axios.get(
  `/payment/orders/${orderId}/receipt`,
  {
    withCredentials: true,
    responseType: "blob", 
  }
);

const blob = new Blob([res.data], {
  type: "application/pdf",
});

const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = `receipt-${order_code}.pdf`;
a.click();

window.URL.revokeObjectURL(url);
};

