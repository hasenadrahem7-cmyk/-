import React from "react"; import { initializeApp } from "firebase/app"; import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, signOut } from "firebase/auth"; import { getDatabase, ref, set, get, child, push } from "firebase/database"; import { Home, User, Settings, ShoppingCart, Bell, MessageCircle, Menu } from "lucide-react";

const firebaseConfig = { apiKey: "AIzaSyADVkZsFfQKiJaHHu54tD0uEVQns2UEsdY", authDomain: "amarglaom-479e1.firebaseapp.com", databaseURL: "https://amarglaom-479e1-default-rtdb.firebaseio.com", projectId: "amarglaom-479e1", storageBucket: "amarglaom-479e1.firebasestorage.app", messagingSenderId: "230656935686", appId: "1:230656935686:android:a1e9828ed3787802f18087" };

const app = initializeApp(firebaseConfig); const database = getDatabase(app); const auth = getAuth(app);

export default function App() { const [currentScreen, setCurrentScreen] = React.useState("login"); const [phone, setPhone] = React.useState(""); const [otp, setOtp] = React.useState(""); const [verificationSent, setVerificationSent] = React.useState(false); const [products, setProducts] = React.useState([]); const [messages, setMessages] = React.useState([]); const [darkMode, setDarkMode] = React.useState(false); const [errorMessage, setErrorMessage] = React.useState(""); const [favorites, setFavorites] = React.useState([]); const [cart, setCart] = React.useState([]); const [search, setSearch] = React.useState(""); const [selectedCompany, setSelectedCompany] = React.useState(''); const [phoneNumber, setPhoneNumber] = React.useState(''); const [rechargeAmount, setRechargeAmount] = React.useState(''); const [bankName, setBankName] = React.useState(''); const [accountNumber, setAccountNumber] = React.useState(''); const [transferAmount, setTransferAmount] = React.useState(''); const [walletNumber, setWalletNumber] = React.useState(''); const [walletAmount, setWalletAmount] = React.useState(''); const [fromCurrency, setFromCurrency] = React.useState('YER'); const [toCurrency, setToCurrency] = React.useState('USD'); const [exchangeAmount, setExchangeAmount] = React.useState(''); const [subscriberNumber, setSubscriberNumber] = React.useState(''); const [subscriberAmount, setSubscriberAmount] = React.useState(''); const [transferCode, setTransferCode] = React.useState(''); const [balanceAmount, setBalanceAmount] = React.useState(''); const [serviceType, setServiceType] = React.useState(''); const [serviceNumber, setServiceNumber] = React.useState(''); const [serviceAmount, setServiceAmount] = React.useState(''); const [cardHolder, setCardHolder] = React.useState(''); const [cardNumber, setCardNumber] = React.useState(''); const [expiryDate, setExpiryDate] = React.useState(''); const [transactions, setTransactions] = React.useState([]); const [beneficiaries, setBeneficiaries] = React.useState([]); const [qrAmount, setQrAmount] = React.useState(''); const [supportMessage, setSupportMessage] = React.useState(''); const [dailyLimit] = React.useState('500,000 YER'); const [fingerprintEnabled, setFingerprintEnabled] = React.useState(false); const [language, setLanguage] = React.useState('العربية'); const [faceIdEnabled, setFaceIdEnabled] = React.useState(false); const [receiptNumber, setReceiptNumber] = React.useState(''); const [pdfReports, setPdfReports] = React.useState([]); const [appReady, setAppReady] = React.useState(false); const [idImage, setIdImage] = React.useState(null); const [kycStatus, setKycStatus] = React.useState('غير موثق'); const [fullName, setFullName] = React.useState(''); const [nationalId, setNationalId] = React.useState(''); const [pushEnabled, setPushEnabled] = React.useState(false); const [lastActivity, setLastActivity] = React.useState(Date.now());

// التحقق من صيغة رقم الهاتف اليمني
const isValidYemeniPhone = (phoneNum) => {
  // صيغ أرقام هواتف يمنية: 967XXXXXXXXX أو +967XXXXXXXXX أو 9671XXXXXXX
  const patterns = [
    /^(\+967|00967)?(7|9)\d{8}$/, // 967 followed by 7 or 9 and 8 digits
    /^(7|9)\d{8}$/ // local format without country code
  ];
  return patterns.some(pattern => pattern.test(phoneNum));
};

// تنسيق رقم الهاتف إلى صيغة دولية
const formatYemeniPhone = (phoneNum) => {
  let cleaned = phoneNum.replace(/\D/g, '');
  
  if (cleaned.startsWith('967')) {
    return '+' + cleaned;
  } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('9'))) {
    return '+967' + cleaned;
  } else if (cleaned.startsWith('00967')) {
    return '+' + cleaned.replace(/^00/, '');
  }
  
  return '+967' + cleaned;
};

const screens = { login: { title: "تسجيل الدخول عبر رقم الهاتف", content: ( <div className="space-y-4"> <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-2xl text-center text-sm font-semibold"> ✓ تسجيل دخول آمن ��رقم هاتفك اليمني </div>

<input
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="رقم الهاتف اليمني (7xxxxxxxx أو 9xxxxxxxx)"
  className="w-full border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all text-right"
/>

<div className="text-xs text-gray-600 text-right bg-gray-50 p-3 rounded-lg">
  صيغ مقبولة:
  <br/>• 777123456 (محلي)
  <br/>• +967777123456 (دولي)
  <br/>• 00967777123456
</div>

{!verificationSent && (
  <button
    onClick={async () => {
      setErrorMessage('');

      if (!phone.trim()) {
        setErrorMessage('الرجاء إدخال رقم الهاتف');
        return;
      }

      if (!isValidYemeniPhone(phone)) {
        setErrorMessage('رقم الهاتف غير صحيح. يجب أن يكون رقم يمني صالح');
        return;
      }

      try {
        const formattedPhone = formatYemeniPhone(phone);
        
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
          callback: (response) => {
            console.log('reCAPTCHA verified');
          }
        });

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          window.recaptchaVerifier
        );

        window.confirmationResult = confirmationResult;
        setVerificationSent(true);
        setErrorMessage('');
      } catch (err) {
        console.error(err);
        setErrorMessage('فشل إرسال رمز التحقق. تأكد من الاتصال بالإنترنت والرقم الصحيح');
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }
      }
    }}
    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-2xl shadow-lg hover:scale-105 transition-all font-bold"
  >
    إرسال رمز التحقق
  </button>
)}

{verificationSent && (
  <>
    <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-2xl text-center text-sm">
      ✓ تم إرسال رمز التحقق إلى رقم <span className="font-bold">{phone}</span>
    </div>

    <input
      type="text"
      value={otp}
      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
      placeholder="أدخل رمز التحقق (6 أرقام)"
      maxLength="6"
      className="w-full border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-green-400 text-center text-2xl tracking-widest transition-all"
    />

    <button
      onClick={async () => {
        try {
          if (otp.length !== 6) {
            setErrorMessage('رمز التحقق يجب أن يكون 6 أرقام');
            return;
          }

          await window.confirmationResult.confirm(otp);
          
          // حفظ بيانات المستخدم في قاعدة البيانات
          const userId = auth.currentUser.uid;
          await set(ref(database, `users/${userId}`), {
            phone: phone,
            phoneFormatted: formatYemeniPhone(phone),
            kycStatus: 'pending',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });

          setCurrentScreen("profile-setup");
          setVerificationSent(false);
          setOtp('');
          setErrorMessage('');
        } catch (err) {
          console.error(err);
          setErrorMessage('رمز التحقق غير صحيح أو منتهي الصلاحية');
        }
      }}
      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl shadow-lg hover:scale-105 transition-all font-bold"
    >
      تأكيد الرمز
    </button>

    <button
      onClick={() => {
        setVerificationSent(false);
        setOtp('');
        setPhone('');
        setErrorMessage('');
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }
      }}
      className="w-full bg-gray-200 text-gray-700 py-3 rounded-2xl hover:bg-gray-300 transition-all"
    >
      العودة
    </button>
  </>
)}

<div id="recaptcha-container" className="flex justify-center"></div>

{errorMessage && (
  <div className="bg-red-100 text-red-600 p-3 rounded-2xl text-center text-sm border border-red-300">
    ⚠️ {errorMessage}
  </div>
)}

<div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-2xl text-center text-xs font-bold">
  خدمة العملاء: 733231636
</div>

<button
  onClick={() => setCurrentScreen("termsPage")}
  className="w-full text-blue-600 p-3 rounded-2xl text-center text-sm hover:text-blue-800 transition-all"
>
  الشروط والأحكام
</button>
  </>
) }},

"profile-setup": {
  title: "إكمال الملف الشخصي",
  content: (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-2xl text-center text-sm">
        ✓ تم التحقق من رقم الهاتف بنجاح
      </div>

      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="الاسم الكامل"
        className="w-full border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all text-right"
      />

      <input
        type="text"
        value={nationalId}
        onChange={(e) => setNationalId(e.target.value)}
        placeholder="رقم الهوية"
        className="w-full border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all text-right"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setIdImage(e.target.files[0])}
        className="w-full border rounded-2xl p-3"
      />

      {idImage && (
        <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl text-center text-sm">
          ✓ تم رفع صورة الهوية: {idImage.name}
        </div>
      )}

      <button
        onClick={async () => {
          if (!fullName.trim()) {
            setErrorMessage('الرجاء إدخال الاسم الكامل');
            return;
          }

          if (!nationalId.trim()) {
            setErrorMessage('الرجاء إدخال رقم الهوية');
            return;
          }

          try {
            await push(ref(database, 'kyc_requests'), {
              phone: phone,
              fullName: fullName,
              nationalId: nationalId,
              idImage: idImage ? idImage.name : null,
              status: 'pending',
              createdAt: new Date().toISOString()
            });

            setKycStatus('قيد المراجعة');
            setCurrentScreen("home");
            setErrorMessage('');
            alert('تم حفظ بيانات الملف الشخصي بنجاح ✓');
          } catch (err) {
            setErrorMessage('حدث خطأ في حفظ البيانات');
          }
        }}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl shadow-lg hover:scale-105 transition-all font-bold"
      >
        حفظ واستمرار
      </button>

      {errorMessage && (
        <div className="bg-red-100 text-red-600 p-3 rounded-2xl text-center text-sm">
          ⚠️ {errorMessage}
        </div>
      )}
    </div>
  )
},

home: {
  title: "الرئيسية",
  content: (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="بحث عن منتج"
        className="w-full border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setCurrentScreen("store")}
          className="bg-gradient-to-r from-green-500 to-emerald-400 text-white p-4 rounded-2xl shadow-md hover:scale-105 transition-all"
        >
          المتجر
        </button>

        <button
          onClick={() => setCurrentScreen("recharge")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          شحن الرصيد
        </button>

        <button
          onClick={() => setCurrentScreen("bankTransfer")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          التحويل البنكي
        </button>

        <button
          onClick={() => setCurrentScreen("walletTransfer")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          تحويل محفظة
        </button>

        <button
          onClick={() => setCurrentScreen("exchange")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          صرف العملات
        </button>

        <button
          onClick={() => setCurrentScreen("subscriberTransfer")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          تحويل لمشترك
        </button>

        <button
          onClick={() => setCurrentScreen("receiveTransfer")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          استلام حوالة
        </button>

        <button
          onClick={() => setCurrentScreen("buyBalance")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          شراء رصيد
        </button>

        <button
          onClick={() => setCurrentScreen("servicePayments")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          تسديد خدمات
        </button>

        <button
          onClick={() => setCurrentScreen("creditCards")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          البطاقات
        </button>

        <button
          onClick={() => setCurrentScreen("transactionHistory")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          العمليات
        </button>

        <button
          onClick={() => setCurrentScreen("beneficiariesPage")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          المستفيدون
        </button>

        <button
          onClick={() => setCurrentScreen("qrPayments")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          QR دفع
        </button>

        <button
          onClick={() => setCurrentScreen("supportCenter")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          الدعم
        </button>

        <button
          onClick={() => setCurrentScreen("securityCenter")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          الحماية
        </button>

        <button
          onClick={() => setCurrentScreen("messages")}
          className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white p-4 rounded-2xl shadow-md hover:scale-105 transition-all"
        >
          الرسائل
        </button>

        <button
          onClick={() => setCurrentScreen("notifications")}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white p-4 rounded-2xl shadow-md hover:scale-105 transition-all"
        >
          الإشعارات
        </button>

        <button
          onClick={() => setCurrentScreen("profile")}
          className="bg-gradient-to-r from-pink-500 to-rose-400 text-white p-4 rounded-2xl shadow-md hover:scale-105 transition-all"
        >
          الملف الشخصي
        </button>
      </div>
    </div>
  )
},

store: {
  title: "المتجر",
  content: (
    <div className="space-y-3">
      {(products.length > 0 ? products : [1,2,3])
        .filter((item) => {
          if (typeof item !== 'object') return true;
          return item.name?.toLowerCase().includes(search.toLowerCase());
        })
        .map((item, index) => (
        <div
          key={item}
          className={`rounded-2xl p-4 flex justify-between items-center shadow-md ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border'}`}
        >
          <div>
            <h2 className="font-bold">{typeof item === 'object' ? item.name : `منتج ${item}`}</h2>
            <p className="text-gray-500">وصف المنتج</p>
            <p className="text-sm text-blue-500">عرض خاص اليوم</p>
          </div>
          <button
            onClick={async () => {
              await push(ref(database, 'orders'), {
                product: typeof item === 'object' ? item.name : `منتج ${item}`,
                time: new Date().toISOString()
              });
              setCart(prev => [...prev, item]);
              alert('تم إضافة الطلب إلى السلة');
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all">
            شراء الآن
          </button>

          <button
            onClick={() => setFavorites(prev => [...prev, item])}
            className="bg-pink-500 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all"
          >
            مفضلة
          </button>
        </div>
      ))}
    </div>
  )
},

messages: {
  title: "الرسائل",
  content: (
    <div className="space-y-3">
      {(messages.length > 0 ? messages : [1,2,3]).map((msg, index) => (
        <div key={msg} className="bg-gray-100 p-4 rounded-2xl">
          {typeof msg === 'object' ? msg.text : `رسالة جديدة رقم ${msg}`}
        </div>
      ))}
    </div>
  )
},

notifications: {
  title: "الإشعارات",
  content: (
    <div className="space-y-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-yellow-100 p-4 rounded-2xl">
          تم تحديث النظام - إشعار رقم {n}
        </div>
      ))}
    </div>
  )
},

recharge: {
  title: "شحن الرصيد",
  content: (
    <div className="space-y-4">
      <select
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
        className="w-full border rounded-2xl p-3"
      >
        <option value="">اختر شركة الاتصالات</option>
        <option>Yemen Mobile</option>
        <option>Sabafon</option>
        <option>YOU</option>
        <option>Y Telecom</option>
      </select>

      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="رقم الهاتف"
        className="w-full border rounded-2xl p-3"
      />

      <input
        value={rechargeAmount}
        onChange={(e) => setRechargeAmount(e.target.value)}
        placeholder="مبلغ الشحن"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'recharges'), {
            company: selectedCompany,
            phone: phoneNumber,
            amount: rechargeAmount,
            createdAt: new Date().toISOString()
          });

          alert('تم تنفيذ طلب شحن الرصيد');
        }}
        className="w-full bg-green-500 text-white py-3 rounded-2xl"
      >
        شحن الآن
      </button>
    </div>
  )
},

bankTransfer: {
  title: "التحويل البنكي",
  content: (
    <div className="space-y-4">
      <select
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        className="w-full border rounded-2xl p-3"
      >
        <option value="">اختر البنك</option>
        <option>بنك الكريمي</option>
        <option>بنك اليمن والكويت</option>
        <option>بنك التضامن</option>
        <option>بنك سبأ الإسلامي</option>
      </select>

      <input
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        placeholder="رقم الحساب"
        className="w-full border rounded-2xl p-3"
      />

      <input
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
        placeholder="مبلغ التحويل"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'bank_transfers'), {
            bank: bankName,
            account: accountNumber,
            amount: transferAmount,
            createdAt: new Date().toISOString()
          });

          alert('تم إرسال طلب التحويل البنكي');
        }}
        className="w-full bg-blue-600 text-white py-3 rounded-2xl"
      >
        تحويل الآن
      </button>
    </div>
  )
},

walletTransfer: {
  title: "التحويل لمحفظة أخرى",
  content: (
    <div className="space-y-4">
      <input
        value={walletNumber}
        onChange={(e) => setWalletNumber(e.target.value)}
        placeholder="رقم المحفظة المستلمة"
        className="w-full border rounded-2xl p-3"
      />

      <input
        value={walletAmount}
        onChange={(e) => setWalletAmount(e.target.value)}
        placeholder="مبلغ التحويل"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'wallet_transfers'), {
            wallet: walletNumber,
            amount: walletAmount,
            createdAt: new Date().toISOString()
          });

          alert('تم تنفيذ التحويل للمحفظة');
        }}
        className="w-full bg-purple-600 text-white py-3 rounded-2xl"
      >
        تحويل الآن
      </button>
    </div>
  )
},

exchange: {
  title: "صرف العملات",
  content: (
    <div className="space-y-4">
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        className="w-full border rounded-2xl p-3"
      >
        <option>YER</option>
        <option>USD</option>
        <option>SAR</option>
      </select>

      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        className="w-full border rounded-2xl p-3"
      >
        <option>USD</option>
        <option>YER</option>
        <option>SAR</option>
      </select>

      <input
        value={exchangeAmount}
        onChange={(e) => setExchangeAmount(e.target.value)}
        placeholder="المبلغ"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'exchange_operations'), {
            from: fromCurrency,
            to: toCurrency,
            amount: exchangeAmount,
            createdAt: new Date().toISOString()
          });

          alert('تم تنفيذ طلب صرف العملات');
        }}
        className="w-full bg-orange-500 text-white py-3 rounded-2xl"
      >
        صرف الآن
      </button>
    </div>
  )
},

subscriberTransfer: {
  title: "التحويل لمشترك",
  content: (
    <div className="space-y-4">
      <input
        value={subscriberNumber}
        onChange={(e) => setSubscriberNumber(e.target.value)}
        placeholder="رقم المشترك"
        className="w-full border rounded-2xl p-3"
      />

      <input
        value={subscriberAmount}
        onChange={(e) => setSubscriberAmount(e.target.value)}
        placeholder="مبلغ التحويل"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'subscriber_transfers'), {
            subscriber: subscriberNumber,
            amount: subscriberAmount,
            createdAt: new Date().toISOString()
          });

          alert('تم التحويل للمشترك بنجاح');
        }}
        className="w-full bg-cyan-600 text-white py-3 rounded-2xl"
      >
        تحويل الآن
      </button>
    </div>
  )
},

receiveTransfer: {
  title: "استلام الحوالات",
  content: (
    <div className="space-y-4">
      <input
        value={transferCode}
        onChange={(e) => setTransferCode(e.target.value)}
        placeholder="أدخل رقم الحوالة"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'received_transfers'), {
            code: transferCode,
            receivedAt: new Date().toISOString()
          });

          alert('تم استلام الحوالة بنجاح');
        }}
        className="w-full bg-emerald-600 text-white py-3 rounded-2xl"
      >
        استلام الآن
      </button>
    </div>
  )
},

buyBalance: {
  title: "شراء رصيد",
  content: (
    <div className="space-y-4">
      <input
        value={balanceAmount}
        onChange={(e) => setBalanceAmount(e.target.value)}
        placeholder="أدخل مبلغ شراء الرصيد"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'balance_purchases'), {
            amount: balanceAmount,
            createdAt: new Date().toISOString()
          });

          alert('تم شراء الرصيد بنجاح');
        }}
        className="w-full bg-indigo-600 text-white py-3 rounded-2xl"
      >
        شراء الآن
      </button>
    </div>
  )
},

servicePayments: {
  title: "تسديد الخدمات",
  content: (
    <div className="space-y-4">
      <select
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
        className="w-full border rounded-2xl p-3"
      >
        <option value="">اختر الخدمة</option>
        <option>كهرباء</option>
        <option>مياه</option>
        <option>إنترنت</option>
        <option>هاتف ثابت</option>
      </select>

      <input
        value={serviceNumber}
        onChange={(e) => setServiceNumber(e.target.value)}
        placeholder="رقم الاشتراك"
        className="w-full border rounded-2xl p-3"
      />

      <input
        value={serviceAmount}
        onChange={(e) => setServiceAmount(e.target.value)}
        placeholder="مبلغ السداد"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'service_payments'), {
            type: serviceType,
            subscriber: serviceNumber,
            amount: serviceAmount,
            createdAt: new Date().toISOString()
          });

          alert('تم تسديد الخدمة بنجاح');
        }}
        className="w-full bg-teal-600 text-white py-3 rounded-2xl"
      >
        تسديد الآن
      </button>
    </div>
  )
},

creditCards: {
  title: "البطاقات الائتمانية",
  content: (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-5 rounded-3xl shadow-2xl space-y-3">
        <div className="text-sm opacity-80">بطاقة افتراضية</div>
        <div className="text-2xl tracking-widest font-bold">
          {cardNumber || '**** **** **** 4587'}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs opacity-70">اسم حامل البطاقة</div>
            <div>{cardHolder || 'USER NAME'}</div>
          </div>
          <div>
            <div className="text-xs opacity-70">تاريخ الانتهاء</div>
            <div>{expiryDate || '12/30'}</div>
          </div>
        </div>
      </div>

      <input
        value={cardHolder}
        onChange={(e) => setCardHolder(e.target.value)}
        placeholder="اسم حامل البطاقة"
        className="w-full border rounded-2xl p-3"
      />

      <input
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="رقم البطاقة"
        className="w-full border rounded-2xl p-3"
      />

      <input
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        placeholder="MM/YY"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'credit_cards'), {
            holder: cardHolder,
            number: cardNumber,
            expiry: expiryDate,
            createdAt: new Date().toISOString()
          });

          alert('تم إنشاء البطاقة بنجاح');
        }}
        className="w-full bg-slate-800 text-white py-3 rounded-2xl"
      >
        إنشاء بطاقة
      </button>
    </div>
  )
},

transactionHistory: {
  title: "سجل العمليات",
  content: (
    <div className="space-y-3">
      {(transactions.length > 0 ? transactions : [
        { type: 'تحويل', amount: '5000 YER' },
        { type: 'شحن رصيد', amount: '2000 YER' },
        { type: 'صرف عملات', amount: '100 USD' }
      ]).map((trx, index) => (
        <div key={index} className="bg-white border rounded-2xl p-4 shadow-sm flex justify-between">
          <div>{trx.type}</div>
          <div className="text-blue-600 font-bold">{trx.amount}</div>
        </div>
      ))}
    </div>
  )
},

beneficiariesPage: {
  title: "المستفيدون",
  content: (
    <div className="space-y-4">
      <button
        onClick={() => {
          const beneficiary = {
            name: 'مستفيد جديد',
            number: '777000111'
          };

          setBeneficiaries(prev => [...prev, beneficiary]);
        }}
        className="w-full bg-blue-600 text-white py-3 rounded-2xl"
      >
        إضافة مستفيد
      </button>

      {beneficiaries.map((item, index) => (
        <div key={index} className="border rounded-2xl p-4 flex justify-between">
          <div>
            <div className="font-bold">{item.name}</div>
            <div className="text-sm text-gray-500">{item.number}</div>
          </div>
        </div>
      ))}
    </div>
  )
},

qrPayments: {
  title: "QR الدفع",
  content: (
    <div className="space-y-4 text-center">
      <div className="bg-black text-white p-10 rounded-3xl text-2xl tracking-widest">
        QR CODE
      </div>

      <input
        value={qrAmount}
        onChange={(e) => setQrAmount(e.target.value)}
        placeholder="مبلغ الدفع"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'qr_payments'), {
            amount: qrAmount,
            createdAt: new Date().toISOString()
          });

          alert('تم إنشاء QR للدفع');
        }}
        className="w-full bg-black text-white py-3 rounded-2xl"
      >
        إنشاء QR
      </button>
    </div>
  )
},

privacyPolicy: {
  title: "سياسة الخصوصية",
  content: (
    <div className="space-y-4 text-sm leading-7 text-gray-700">
      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        نقوم بحماية بيانات المستخدم وعدم مشاركتها مع أي طرف غير مصرح.
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        يتم تشفير عمليات تسجيل الدخول والتحويلات والبيانات الحساسة.
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        استخدام التطبيق يعني الموافقة على الشروط وسياسات الحماية.
      </div>
    </div>
  )
},

termsPage: {
  title: "الشروط والأحكام",
  content: (
    <div className="space-y-4 text-sm leading-7 text-gray-700">
      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        يمنع استخدام التطبيق في أي نشاط مخالف للقوانين المالية.
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        المستخدم مسؤول عن حماية بيانات تسجيل الدخول الخاصة به.
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border">
        قد يتم إيقاف الحسابات المخالفة أو المشبوهة لحماية النظام.
      </div>
    </div>
  )
},

supportCenter: {
  title: "مركز الدعم والشكاوى",
  content: (
    <div className="space-y-4">
      <textarea
        value={supportMessage}
        onChange={(e) => setSupportMessage(e.target.value)}
        placeholder="اكتب رسالتك أو الشكوى"
        className="w-full border rounded-2xl p-3 min-h-[120px]"
      />

      <button
        onClick={async () => {
          await push(ref(database, 'support_messages'), {
            message: supportMessage,
            createdAt: new Date().toISOString()
          });

          alert('تم إرسال الرسالة لخدمة العملاء');
        }}
        className="w-full bg-red-600 text-white py-3 rounded-2xl"
      >
        إرسال الشكوى
      </button>

      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-2xl text-center text-xs font-bold">
        خدمة العملاء: 733231636
      </div>
    </div>
  )
},

reportsCenter: {
  title: "التقارير والإيصالات",
  content: (
    <div className="space-y-4">
      <input
        value={receiptNumber}
        onChange={(e) => setReceiptNumber(e.target.value)}
        placeholder="رقم العملية"
        className="w-full border rounded-2xl p-3"
      />

      <button
        onClick={() => {
          const report = {
            id: receiptNumber || Date.now(),
            date: new Date().toLocaleString()
          };

          setPdfReports(prev => [...prev, report]);
          alert('تم إنشاء الإيصال بنجاح');
        }}
        className="w-full bg-gray-900 text-white py-3 rounded-2xl"
      >
        إنشاء إيصال PDF
      </button>

      {pdfReports.map((item, index) => (
        <div key={index} className="border rounded-2xl p-4 bg-white shadow-sm">
          <div className="font-bold">رقم العملية: {item.id}</div>
          <div className="text-sm text-gray-500">{item.date}</div>
        </div>
      ))}
    </div>
  )
},

securityCenter: {
  title: "الحماية المتقدمة",
  content: (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-2xl">
        الحد اليومي للتحويل: {dailyLimit}
      </div>

      <button
        onClick={() => {
          setFingerprintEnabled(!fingerprintEnabled);
          alert(fingerprintEnabled ? 'تم إيقاف البصمة' : 'تم تفعيل البصمة');
        }}
        className="w-full bg-black text-white py-3 rounded-2xl"
      >
        {fingerprintEnabled ? 'إيقاف البصمة' : 'تفعيل البصمة'}
      </button>

      <button
        onClick={() => {
          setFaceIdEnabled(!faceIdEnabled);
          alert(faceIdEnabled ? 'تم إيقاف Face ID' : 'تم تفعيل Face ID');
        }}
        className="w-full bg-blue-700 text-white py-3 rounded-2xl"
      >
        {faceIdEnabled ? 'إيقاف Face ID' : 'تفعيل Face ID'}
      </button>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full border rounded-2xl p-3"
      >
        <option>العربية</option>
        <option>English</option>
      </select>
    </div>
  )
},

profile: {
  title: "الملف الشخصي",
  content: (
    <div className="space-y-4 text-center">
      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mx-auto shadow-xl border-4 border-white"></div>
      <div className="mb-4 text-center">
        <div className="text-2xl font-extrabold text-blue-600 tracking-widest">
          JEEB PAY
        </div>
        <div className="text-xs text-gray-500">
          Digital Wallet & Financial Services
        </div>
      </div>

      <h2 className="text-xl font-bold">{fullName || 'اسم المستخدم'}</h2>
      <p className="text-gray-500">{phone || 'رقم الهاتف'}</p>
      <div className="bg-yellow-100 text-yellow-700 p-3 rounded-2xl">
        حالة الحساب: {kycStatus}
      </div>

      <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
        عدد المفضلة: {favorites.length}
      </div>

      <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
        عدد الطلبات: {cart.length}
      </div>

      <button
        onClick={() => setCurrentScreen("settings")}
        className="w-full bg-gray-800 text-white py-3 rounded-2xl"
      >
        الإعدادات
      </button>
    </div>
  )
},

settings: {
  title: "الإعدادات والأمان",
  content: (
    <div className="space-y-3">
      <button className="w-full bg-gray-100 p-4 rounded-2xl text-right">
        تغيير كلمة المرور
      </button>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="w-full bg-gray-100 text-black p-4 rounded-2xl text-right hover:bg-gray-200 transition-all">
        تبديل الوضع الليلي
      </button>

      <button
        onClick={async () => {
          await signOut(auth);
          localStorage.removeItem('userLoggedIn');
          setCurrentScreen('login');
          setPhone('');
          setOtp('');
          setVerificationSent(false);
        }}
        className="w-full bg-red-500 text-white p-4 rounded-2xl font-bold">
        تسجيل الخروج
      </button>
    </div>
  )
}

};

React.useEffect(() => { const session = localStorage.getItem('userLoggedIn');

if (session === 'true') {
  setCurrentScreen('home');
}

const loadData = async () => {
  const dbRef = ref(database);

  const productsSnapshot = await get(child(dbRef, 'products'));
  if (productsSnapshot.exists()) {
    setProducts(Object.values(productsSnapshot.val()));
  }

  const messagesSnapshot = await get(child(dbRef, 'messages'));
  if (messagesSnapshot.exists()) {
    setMessages(Object.values(messagesSnapshot.val()));
  }
};

loadData();

console.log('Security Enabled: Validation, Session Protection, Firebase Authentication');

const autoLogout = setInterval(() => {
  const inactiveTime = Date.now() - lastActivity;

  if (inactiveTime > 1000 * 60 * 30) {
    localStorage.removeItem('userLoggedIn');
    setCurrentScreen('login');
  }
}, 10000);

return () => clearInterval(autoLogout); }, []);

React.useEffect(() => {
const timer = setTimeout(() => {
  setAppReady(true);
}, 2500);

return () => clearTimeout(timer);

}, []);

if (!appReady) { return ( <div className="min-h-screen bg-gradient-to-br from-blue-700 to-cyan-500 flex flex-col items-center justify-center text-white"> <div className="w-28 h-28 rounded-3xl bg-white text-blue-700 flex items-center justify-center text-5xl font-extrabold shadow-2xl"> J </div>

<h1 className="text-4xl font-extrabold mt-6 tracking-widest">
      JEEB PAY
    </h1>

    <p className="mt-2 opacity-80">
      Smart Digital Wallet
    </p>
  </div>
);

}

return ( <div className={`${darkMode ? 'bg-black' : 'bg-gradient-to-br from-blue-100 to-gray-200'} min-h-screen flex items-center justify-center p-4 transition-all duration-500`}> <div className={`w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white border-gray-200'} transition-all duration-500`}> {/* Header */} <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-5 flex items-center justify-between shadow-lg"> <div className="flex items-center gap-3 flex-1"> <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-extrabold text-xl shadow-lg"> J </div>

<div>
          <h1 className="text-xl font-extrabold tracking-wide">JEEB PAY</h1>
          <p className="text-xs opacity-80">Smart Digital Wallet</p>
        </div>
      </div>

      <h1 className="text-lg font-bold flex-1 text-center">
        {screens[currentScreen]?.title}
      </h1>

      <button onClick={() => setCurrentScreen('notifications')}>
        <Bell size={24} />
      </button>
    </div>

    {/* Content */}
    <div
      onClick={() => setLastActivity(Date.now())}
      className="p-5 min-h-[500px] overflow-y-auto">
      {screens[currentScreen]?.content}
    </div>

    {/* Bottom Navigation */}
    {currentScreen !== "login" && currentScreen !== "profile-setup" && (
      <div className={`border-t p-3 flex justify-around ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'} shadow-inner`}>
        <button
          onClick={() => setCurrentScreen("home")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <Home size={20} />
          الرئيسية
        </button>

        <button
          onClick={() => setCurrentScreen("store")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <ShoppingCart size={20} />
          المتجر
        </button>

        <button
          onClick={() => setCurrentScreen("messages")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <MessageCircle size={20} />
          الرسائل
        </button>

        <button
          onClick={() => setCurrentScreen("profile")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <User size={20} />
          الحساب
        </button>

        <button
          onClick={() => setCurrentScreen("settings")}
          className="flex flex-col items-center text-sm hover:text-blue-500 transition-all"
        >
          <Settings size={20} />
          الإعدادات
        </button>
      </div>
    )}
  </div>
</div>

); }

// ============================= // PROJECT EXPORT GUIDE // =============================

/* الخيار الأول: مشروع React Native + Expo

الملفات الأساسية:

App.js

firebase.js

package.json

app.json

assets/logo.png

screens/

components/


الحزم المطلوبة: expo react-native firebase react-navigation react-native-safe-area-context react-native-screens react-native-vector-icons

أوامر التشغيل: npm install npx expo start

بناء APK: eas build -p android --profile preview */

/* الخيار الثاني: رفع المشروع إلى Replit

الخطوات: 1- إنشاء مشروع Node.js 2- رفع الملفات 3- تشغيل npm install 4- تشغيل npm start 5- ربط Firebase 6- تصدير APK عبر Expo */

export const projectInfo = { appName: 'JEEB PAY', version: '1.0.0', packageName: 'com.jeebpay.wallet', supportNumber: '733231636', firebase: true, phoneAuth: true, kyc: true, bankTransfers: true, walletTransfers: true, recharge: true, qrPayments: true, cards: true };
