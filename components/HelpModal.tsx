import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-xl shadow-lg">
              💡
            </div>
            <h2 className="text-2xl font-bold text-white">泡泡龍使用說明</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all text-slate-400 hover:text-white"
            aria-label="關閉"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="prose prose-invert prose-slate max-w-none">
            <section className="mb-8">
              <h3 className="text-xl font-bold text-blue-400 mb-3">📖 什麼是泡泡龍？</h3>
              <p className="text-slate-300 leading-relaxed">
                泡泡龍是一款專業的 AI 圖像生成提示詞工具，幫助你創建精確、專業級的攝影提示詞。
                無論你是攝影師、設計師還是 AI 藝術家，泡泡龍都能讓你像專業攝影師一樣控制每個細節。
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-blue-400 mb-3">🎯 核心概念</h3>
              <ul className="text-slate-300 space-y-2">
                <li>✓ 參數驅動設計：不需要手動輸入文字</li>
                <li>✓ 按鈕式選擇：所有選項都是按鈕，點擊即可</li>
                <li>✓ 即時預覽：右側面板即時顯示生成的提示詞</li>
                <li>✓ 通用相容：適用於任何 AI 圖像生成平台</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-blue-400 mb-3">🚀 快速開始</h3>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">方法一：使用預設集（推薦）</h4>
                <ol className="text-slate-300 space-y-2 list-decimal list-inside">
                  <li>點擊左側導航的「藝廊預設」或頂部的「預設」按鈕</li>
                  <li>瀏覽不同類別的專業攝影設定</li>
                  <li>點擊任一預設集，系統會自動載入所有參數</li>
                  <li>根據需求微調參數</li>
                </ol>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-2">方法二：從零開始</h4>
                <p className="text-slate-300">按照 8 個步驟逐步設定你的攝影參數</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-blue-400 mb-3">📋 8 步驟工作流程</h3>
              <div className="space-y-3">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white mb-1">Step 00 - 藝廊預設</h4>
                  <p className="text-sm text-slate-400">從精選的專業攝影預設中選擇</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white mb-1">Step 01 - 主體細節</h4>
                  <p className="text-sm text-slate-400">定義拍攝主體、材質、顏色和尺寸</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white mb-1">Step 02 - 場景空間</h4>
                  <p className="text-sm text-slate-400">設定拍攝環境、背景和景深效果</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white mb-1">Step 03 - 攝影設定</h4>
                  <p className="text-sm text-slate-400">控制鏡頭焦距、景深、相機角度和構圖</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white mb-1">Step 04 - 燈光物理</h4>
                  <p className="text-sm text-slate-400">專業攝影棚燈光控制和三點照明系統</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white mb-1">Step 05 - 模擬風格</h4>
                  <p className="text-sm text-slate-400">後製效果和風格化處理</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white mb-1">Step 06 - 協定導出</h4>
                  <p className="text-sm text-slate-400">查看並複製完整提示詞</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
                  <h4 className="font-semibold text-white mb-1">Step 07 - 系統設定</h4>
                  <p className="text-sm text-slate-400">管理自訂標籤和使用者預設集</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-blue-400 mb-3">💡 進階技巧</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-white mb-1">微距模式</h4>
                  <p className="text-sm text-slate-400">選擇「微距鏡頭」拍攝極小物體的特寫</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">大遠景模式</h4>
                  <p className="text-sm text-slate-400">選擇「大遠景 (EWS)」拍攝廣闊場景</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">自訂標籤</h4>
                  <p className="text-sm text-slate-400">在任何標籤區域點擊「+ 新增自訂標籤」建立專屬標籤庫</p>
                </div>
              </div>
            </section>

            <section className="mb-4">
              <h3 className="text-xl font-bold text-blue-400 mb-3">🎯 最佳實踐</h3>
              <ul className="text-slate-300 space-y-2">
                <li>✓ 從預設集開始，再微調參數</li>
                <li>✓ 保持簡潔，避免過多衝突的風格標籤</li>
                <li>✓ 善用視覺化工具（3D 控制器、燈光方向盤）</li>
                <li>✓ 實驗與迭代：測試結果後調整參數</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all"
          >
            開始使用泡泡龍
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
