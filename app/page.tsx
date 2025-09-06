"use client";

import { useState, useEffect } from "react";

interface Request {
  id: number;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formalMode, setFormalMode] = useState(false);
  const [hearts, setHearts] = useState<
    { id: number; left: string; size: number }[]
  >([]);
  const [showEngineerLogin, setShowEngineerLogin] = useState(false);
  const [engineerUsername, setEngineerUsername] = useState("");
  const [engineerPassword, setEngineerPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    if (submitted && !formalMode) {
      const interval = setInterval(() => {
        const newHeart = {
          id: Date.now(),
          left: `${Math.random() * 90 + 5}%`,
          size: Math.random() * 15 + 10,
        };
        setHearts((prev) => [...prev, newHeart]);

        setTimeout(() => {
          setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id));
        }, 3000);
      }, 300);

      return () => clearInterval(interval);
    }
  }, [submitted, formalMode]);

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error("خطا در دریافت درخواست‌ها:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && body.trim()) {
      try {
        const response = await fetch("/api/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content: body }),
        });

        if (response.ok) {
          setSubmitted(true);
          if (isAdmin) {
            fetchRequests();
          }
        }
      } catch (error) {
        console.error("خطا در ارسال درخواست:", error);
        alert("خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.");
      }
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setTitle("");
    setBody("");
  };

  const toggleFormalMode = () => {
    setFormalMode(!formalMode);
  };

  const handleEngineerLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (engineerUsername === "milad" && engineerPassword === "milad") {
      setIsAdmin(true);
      alert("خوش آمدید مهندس!");
    } else {
      alert("نام کاربری یا رمز عبور اشتباه است");
    }

    setShowEngineerLogin(false);
    setEngineerUsername("");
    setEngineerPassword("");
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error("خطا در به‌روزرسانی وضعیت:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fa-IR");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${
        formalMode
          ? "bg-gradient-to-br from-gray-50 to-gray-100"
          : "bg-gradient-to-br from-pink-50 to-purple-100"
      }`}
    >
      {/* Floating hearts background - only in informal mode */}
      {!formalMode &&
        hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute animate-float text-pink-400"
            style={{
              left: heart.left,
              bottom: "-10px",
              fontSize: `${heart.size}px`,
              animationDuration: `${Math.random() * 3 + 3}s`,
            }}
          >
            ❤️
          </div>
        ))}

      {/* Engineer login modal */}
      {showEngineerLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white z-100 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              ورود مهندس
            </h2>
            <form onSubmit={handleEngineerLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام کاربری
                </label>
                <input
                  value={engineerUsername}
                  onChange={(e) => setEngineerUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="نام کاربری"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رمز عبور
                </label>
                <input
                  value={engineerPassword}
                  onChange={(e) => setEngineerPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  type="password"
                  placeholder="رمز عبور"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gray-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  ورود
                </button>
                <button
                  type="button"
                  onClick={() => setShowEngineerLogin(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && showAdminPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                پنل مدیریت درخواست‌ها
              </h2>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                بستن
              </button>
            </div>

            {requests.length === 0 ? (
              <p className="text-center text-gray-500">
                هیچ درخواستی وجود ندارد
              </p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status === "approved"
                          ? "تایید شده"
                          : request.status === "rejected"
                            ? "رد شده"
                            : "در انتظار"}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{request.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusUpdate(request.id, "approved")
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          تایید
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request.id, "rejected")
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          رد
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <button
          onClick={() => setShowEngineerLogin(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          ورود مهندس
        </button>
        {isAdmin && (
          <button
            onClick={() => setShowAdminPanel(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            مدیریت درخواست‌ها
          </button>
        )}
        <button
          onClick={toggleFormalMode}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            formalMode
              ? "bg-gray-700 text-white hover:bg-gray-800"
              : "bg-purple-200 text-purple-700 hover:bg-purple-300"
          } transition-colors`}
        >
          {formalMode ? "حالت غیررسمی" : "حالت رسمی"}
        </button>
      </div>

      <main
        className={`w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8 relative z-10 ${
          formalMode
            ? "bg-white border border-gray-200"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-lg ${
                formalMode
                  ? "bg-gradient-to-r from-gray-600 to-gray-800"
                  : "bg-gradient-to-r from-pink-400 to-purple-500"
              }`}
            >
              {formalMode ? "📋" : "💌"}
            </div>
          </div>
          <h1
            className={`text-2xl font-bold ${
              formalMode ? "text-gray-800" : "text-purple-800"
            }`}
          >
            مهندس محبی
          </h1>
          <p
            className={`text-sm mt-2 ${
              formalMode ? "text-gray-600" : "text-purple-500"
            }`}
          >
            صفحه مخصوص درخواست به سرکار خانم مینا محبی
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div
              className={`p-4 rounded-xl border ${
                formalMode
                  ? "bg-gray-50 border-gray-300"
                  : "bg-pink-50 border-pink-200"
              }`}
            >
              <label
                className={`block text-sm font-medium mb-2 ${
                  formalMode ? "text-gray-700" : "text-pink-700"
                }`}
              >
                عنوان درخواست
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent ${
                  formalMode
                    ? "border-gray-300 focus:ring-gray-400"
                    : "border-pink-300 focus:ring-pink-400"
                }`}
                placeholder={
                  formalMode ? "درخواست رسمی برای همکاری" : "درخواست بیرون رفتن"
                }
                type="text"
                name="title"
                required
              />
            </div>

            <div
              className={`p-4 rounded-xl border ${
                formalMode
                  ? "bg-gray-50 border-gray-300"
                  : "bg-pink-50 border-pink-200"
              }`}
            >
              <label
                className={`block text-sm font-medium mb-2 ${
                  formalMode ? "text-gray-700" : "text-pink-700"
                }`}
              >
                متن درخواست
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent ${
                  formalMode
                    ? "border-gray-300 focus:ring-gray-400"
                    : "border-pink-300 focus:ring-pink-400"
                }`}
                placeholder={
                  formalMode
                    ? "ضمن احترام، بدین وسیله درخواست خود را به شرح ذیل ارائه می‌نماید..."
                    : "اینجا یه متن فان بنویس..."
                }
                rows={4}
                name="body"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className={`flex-1 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                  formalMode
                    ? "bg-gradient-to-r from-gray-600 to-gray-800"
                    : "bg-gradient-to-r from-pink-500 to-purple-600"
                }`}
              >
                <span className="flex items-center justify-center">
                  {formalMode ? "ارسال درخواست" : "ارسال تملک نامه"}
                  <span className="mr-2">{formalMode ? "📨" : "👑"}</span>
                </span>
              </button>

              {!formalMode && (
                <button
                  type="button"
                  onClick={() => {
                    setTitle("درخواست رسمی برای برده بودن");
                    setBody(
                      "برای 24 ساعت کار بی وقفه درخواست ارسال می شود در حضور سرکار خانوم مینا محبی"
                    );
                  }}
                  className={`px-4 py-3 border rounded-lg hover:bg-purple-50 transition-colors ${
                    formalMode
                      ? "border-gray-300 text-gray-600 hover:bg-gray-100"
                      : "border-purple-300 text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  پر کردن خودکار
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="text-center animate-fade-in">
            <div
              className={`p-6 rounded-2xl border shadow-inner ${
                formalMode
                  ? "bg-gray-100 border-gray-300"
                  : "bg-gradient-to-br from-pink-100 to-purple-100 border-pink-200"
              }`}
            >
              <div className="text-5xl mb-4">{formalMode ? "✅" : "🎀"}</div>
              <h2
                className={`text-xl font-bold mb-2 ${
                  formalMode ? "text-gray-800" : "text-purple-800"
                }`}
              >
                درخواست شما ثبت شد!
              </h2>
              <p className={formalMode ? "text-gray-600" : "text-purple-600"}>
                {formalMode
                  ? "درخواست شما با موفقیت ثبت و جهت بررسی ارسال گردید."
                  : "درخواست شما با موفقیت برای سرکار خانم مینا محبی ارسال گردید."}
              </p>

              <div
                className={`p-4 rounded-xl mb-5 shadow-sm text-right mt-4 ${
                  formalMode ? "bg-white border border-gray-200" : "bg-white"
                }`}
              >
                <h3
                  className={`font-medium mb-2 ${
                    formalMode ? "text-gray-700" : "text-pink-700"
                  }`}
                >
                  عنوان درخواست:
                </h3>
                <p className={formalMode ? "text-gray-800" : "text-purple-800"}>
                  {title}
                </p>

                <h3
                  className={`font-medium mb-2 mt-4 ${
                    formalMode ? "text-gray-700" : "text-pink-700"
                  }`}
                >
                  متن درخواست:
                </h3>
                <p
                  className={`whitespace-pre-line ${
                    formalMode ? "text-gray-800" : "text-purple-800"
                  }`}
                >
                  {body}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    formalMode
                      ? "border-gray-300 text-gray-600 hover:bg-gray-100"
                      : "border-purple-300 text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  ارسال درخواست جدید
                </button>

                {!formalMode && (
                  <button
                    onClick={() => {
                      alert(
                        "📩 پیامک ارسال شد: 'عزیزم یه درخواست برات اومده، زود بیا ببین چی نوشتم! 💌'"
                      );
                    }}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition-colors"
                  >
                    ارسال یادآوری
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-xs text-gray-500">
        <p>
          ساخته شده با ❤️ توسط goodi goodi برای مینای عزیز | امروز:{" "}
          {new Date().toLocaleDateString("fa-IR")}
        </p>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 3s linear forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
