import crypto from 'crypto';
import Booking from '../model/Booking';

interface PaymentForm {
    currency: string;
    orderReference?: string;
    productName: string[];
    productPrice?: number[];
    productCount: number[];
}

class WayForPayService {
    private merchantAccount: string;
    private merchantSecretKey: string;
    private merchantDomain: string;
    private apiUrl: string;

    constructor() {
        this.merchantAccount = process.env.MERCHANT_ACCOUNT!;
        this.merchantSecretKey = process.env.MERCHANT_SECRET!;
        this.merchantDomain = process.env.MERCHANT_DOMAIN!;
        this.apiUrl = process.env.WAYFORPAY_PURCHASE_URL!;
    }

    generateSignature(...data: any): string {
        const strginData = Object.values(data).join(';');
        return crypto.createHmac('md5', this.merchantSecretKey).update(strginData).digest('hex');
    }

    async createPaymentForm(params: PaymentForm): Promise<string> {

        const { currency, productName, productCount, orderReference } = params;

        const booking = await Booking.findOne({ orderReference });
        if (!booking) {
            throw new Error('Booking with this oid not found');
        }
        const { orderDate, productPrice } = booking;
        console.log('found booking:', booking);

        const message = `${this.merchantAccount};${this.merchantDomain};${orderReference};${orderDate};${productPrice};${currency};${productName};${productPrice};${productCount}`;
        console.log('this is string at createPaymentForm stage', message);
        const hmac = crypto.createHmac('md5', this.merchantSecretKey);
        hmac.update(message);
        const merchantSignature = hmac.digest('hex');

        console.log('wfp service, this is VALID merchant signature ' + merchantSignature);

        const HTML_FORM = `
            <form method="post" action="https://secure.wayforpay.com/pay" accept-charset="utf-8">
                <input type="hidden" name="merchantAccount" value="${this.merchantAccount}">
                <input type="hidden" name="merchantAuthType" value="SimpleSignature">
                <input type="hidden" name="merchantDomainName" value="${this.merchantDomain}">
                <input type="hidden" name="orderReference" value="${orderReference}">
                <input type="hidden" name="orderDate" value="${orderDate}">
                <input type="hidden" name="amount" value="${productPrice}">
                <input type="hidden" name="currency" value="UAH">
                <input type="hidden" name="orderTimeout" value="49000">
                <input type="hidden" name="productName[]" value="photosession">
                <input type="hidden" name="productPrice[]" value="${productPrice}">
                <input type="hidden" name="productCount[]" value="${productCount}">
                <input type="hidden" name="defaultPaymentSystem" value="card">
                <input type="hidden" name="serviceUrl" value="https://d70c-46-33-39-10.ngrok-free.app/api/payments/set-status">
                <input type="hidden" name="merchantSignature" value="${merchantSignature}">
                <input type="submit" value="Перейти до оплати">
            </form>`

        return HTML_FORM;
    }
}

export default WayForPayService;