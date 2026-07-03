import { useRef } from "react";
import QRCode from "qrcode";

async function generateQR(text) {
  try {
    return await QRCode.toDataURL(text, { width: 120, margin: 1 });
  } catch {
    return "";
  }
}

export default function TicketDownload({ booking }) {
  async function handleDownload() {
    const qrDataUrl = await generateQR(
      `https://travel-booking-mern.vercel.app/bookings/${booking._id}`
    );

    const ticketHTML = `
      <html>
      <head>
        <title>Ticket - ${booking.tour?.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; justify-content: center; padding: 30px; }
          .ticket { background: white; width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .ticket-header { background: linear-gradient(135deg, #1a4d8f, #2980b9); color: white; padding: 24px 28px; }
          .ticket-header h1 { font-size: 22px; margin-bottom: 4px; }
          .ticket-header p { opacity: 0.85; font-size: 13px; }
          .ticket-body { padding: 24px 28px; }
          .ticket-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
          .ticket-field { flex: 1; }
          .ticket-field label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px; }
          .ticket-field span { font-size: 15px; font-weight: 600; color: #222; }
          .divider { border: none; border-top: 2px dashed #e0e0e0; margin: 20px 0; }
          .ticket-footer { display: flex; justify-content: space-between; align-items: center; padding: 16px 28px; background: #f9f9f9; border-top: 1px solid #eee; }
          .booking-id { font-size: 11px; color: #888; }
          .booking-id span { font-weight: 700; color: #1a4d8f; font-size: 13px; display: block; }
          .status-badge { background: #d4edda; color: #155724; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
          .brand { font-size: 13px; color: #1a4d8f; font-weight: 700; }
          img.qr { width: 100px; height: 100px; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <h1>✈ TravelBook</h1>
            <p>Booking Confirmation Ticket</p>
          </div>
          <div class="ticket-body">
            <div class="ticket-row">
              <div class="ticket-field"><label>Tour</label><span>${booking.tour?.title}</span></div>
              <div class="ticket-field"><label>Destination</label><span>📍 ${booking.tour?.destination}</span></div>
            </div>
            <div class="ticket-row">
              <div class="ticket-field"><label>Travel Date</label><span>${new Date(booking.travelDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></div>
              <div class="ticket-field"><label>Travelers</label><span>${booking.numberOfTravelers} person${booking.numberOfTravelers > 1 ? "s" : ""}</span></div>
            </div>
            <div class="ticket-row">
              <div class="ticket-field"><label>Amount Paid</label><span>₹${booking.totalPrice?.toLocaleString()}</span></div>
              <div class="ticket-field"><label>Payment Status</label><span style="color:#27ae60;">✅ Confirmed</span></div>
            </div>
            <hr class="divider" />
            <div class="ticket-row" style="align-items:center;">
              <div>
                <p style="font-size:11px;color:#888;margin-bottom:6px;">SCAN TO VERIFY BOOKING</p>
                <img class="qr" src="${qrDataUrl}" alt="QR Code" />
              </div>
              <div class="ticket-field" style="text-align:right;">
                <label>Booked On</label>
                <span>${new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>
          </div>
          <div class="ticket-footer">
            <div class="booking-id">BOOKING ID<span>#${booking._id?.slice(-8).toUpperCase()}</span></div>
            <span class="status-badge">✓ CONFIRMED</span>
            <span class="brand">✈ TravelBook</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(ticketHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }

  return (
    <button className="ticket-btn" onClick={handleDownload}>
      🎫 Download Ticket
    </button>
  );
}
