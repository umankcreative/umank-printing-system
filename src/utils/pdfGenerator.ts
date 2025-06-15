import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Order } from '../types/api';

export const generatePDF = async (order: Order) => {
  try {
    // Get the invoice element
    const element = document.getElementById('invoice-content');
    if (!element) throw new Error('Invoice element not found');

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Download the PDF
    pdf.save(`invoice-${order.id.slice(0, 8)}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
