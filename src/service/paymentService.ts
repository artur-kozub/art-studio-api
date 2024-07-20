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
    private wfpApiUrl: string;

    constructor() {
        this.merchantAccount = process.env.MERCHANT_ACCOUNT!;
        this.merchantSecretKey = process.env.MERCHANT_SECRET!;
        this.merchantDomain = process.env.MERCHANT_DOMAIN!;
        this.wfpApiUrl = process.env.WAYFORPAY_PURCHASE_URL!;
    }

    async createPaymentForm(params: PaymentForm): Promise<string> {

        const { currency, productName, productCount, orderReference } = params;

        const booking = await Booking.findOne({ orderReference });
        if (!booking) {
            throw new Error('Booking with this oid not found');
        }
        const { orderDate, productPrice } = booking;

        const message = `${this.merchantAccount};${this.merchantDomain};${orderReference};${orderDate};${productPrice};${currency};${productName};${productCount};${productPrice}`;
        const hmac = crypto.createHmac('md5', this.merchantSecretKey);
        hmac.update(message);
        const merchantSignature = hmac.digest('hex');

        const serviceUrl = process.env.WFP_SERVICE_URL
        const webApp = process.env.WEB_APP_URL

        const HTML_FORM = `
        <form method="post" action=${this.wfpApiUrl} accept-charset="utf-8" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
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
            <input type="hidden" name="serviceUrl" value="${serviceUrl}api/payments/set-status">
            <input type="hidden" name="merchantSignature" value="${merchantSignature}">
            <input type="hidden" name="returnUrl" value="${webApp}">
            <input type="submit" value="Перейти до оплати" style="width: 622px; height: 96px; border-radius: 4px; box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.18); background: #b3907a; font-family: Roboto; font-style: normal; font-weight: 900; font-size: 40px; text-align: center; color: #ffffff">
        </form>`

        return HTML_FORM;
    }
}

export default WayForPayService;