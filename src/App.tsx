import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Bell, 
  TrendingUp, 
  Package, 
  AlertCircle, 
  ChevronRight, 
  BarChart2, 
  CheckCircle,
  X,
  Search,
  Activity,
  Edit3,
  Calculator,
  LayoutDashboard,
  Truck,
  Wallet,
  PieChart,
  ArrowRightLeft, 
  FileText,
  Megaphone,
  Clock,
  Download,
  ShieldCheck,
  LogOut,
  HelpCircle,
  Zap,
  Clipboard,
  RefreshCw,
  Database,
  FileInput, 
  CheckSquare,
  ArrowRight,
  MapPin,
  PackageCheck,
  Loader,
  Send,          
  Bot,           
  Sparkles,
  FileCheck      
} from 'lucide-react';

// --- 1. 类型定义 ---

interface UserProfile {
  name: string;
  company: string;
  region: string;
  tier: string;
}

interface CipStats {
  creditLimit: number;
  creditUsed: number;
  balance: number;
  rebatePool: number;
  ordersPending: number;
  ordersShipping: number;
  nextBillDate: string;
}

interface Announcement {
  id: number;
  title: string;
  date: string;
  tag: string;
  important: boolean;
}

interface LogisticsStep {
  time: string;
  status: string;
  detail?: string;
  done: boolean;
}

interface Order {
  id: string;
  date: string;
  amount: number;
  status: string;
  items: string;
  type: 'standard' | 'ai-generated';
  logistics?: LogisticsStep[];
}

interface Insight {
  id: number;
  type: 'critical' | 'opportunity';
  title: string;
  description: string;
  icon: React.ElementType;
  color: 'red' | 'blue';
  actionKey?: string; 
}

interface CalculationDetails {
  avgSales: number;
  trendFactor: number;
  realBurn: number;
  safetyDays: number;
  strategicBuffer: number;
  formula: 'flu' | 'stable';
}

interface Product {
  id: string;
  name: string;
  category: string;
  initialStock: number;
  stock?: number; 
  stockSource?: 'ddi' | 'manual'; 
  burnRateDisplay: string;
  reason: string;
  confidence: number;
  status: 'Critical' | 'Stable' | 'Low';
  price: number;
  calc: CalculationDetails;
  aiSuggestion?: number; 
  stockoutDate?: string; 
  qty?: number; 
}

interface KnowledgeBaseItem {
  keywords: string[];
  answer: string;
  followUp?: string;
  isMarketingTrigger?: boolean;
}

interface Message {
  type: 'bot' | 'user';
  text?: string;
  options?: { label: string; value: string; action: string }[];
}

interface TrendDataPoint {
  trend: number[];
  prediction: string;
  riskLevel: 'High' | 'Medium' | 'Low';
}

interface RegionTrendData {
  [drugName: string]: TrendDataPoint;
}

// Fixed: Added missing Props interfaces to prevent TS2304

interface CoPilotProps {
  isOpen: boolean;
  toggle: () => void;
}

interface RegionalTrendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FirstQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HomeViewProps {
  navigateTo: (view: string) => void;
  openTrendModal: () => void;
  openQualificationModal: () => void;
}

interface OrdersViewProps {
  products: Product[];
  cart: Product[];
  navigateTo: (view: string) => void;
  orders: Order[];
  onSubmitOrder: (total: number, summary: string) => void;
  onTrackOrder: (order: Order) => void;
}

interface SmartReplenishViewProps {
  cart: Product[];
  addToCart: (product: Product, qty: number) => void;
  setShowAnalysis: (product: Product | null) => void;
  openAdjustmentModal: (product: Product) => void;
  inputQuantities: Record<string, number>;
  cartTotal: number;
  products: Product[];
  navigateTo: (view: string) => void;
  toggleStockModal: () => void;
  openTrendModal: () => void;
}

// --- 2. 模拟数据 ---

const USER_PROFILE: UserProfile = {
  name: "陈先生",
  company: "四川医药配送有限公司",
  region: "中国西南区（四川盆地）",
  tier: "金牌一级经销商"
};

const CIP_STATS: CipStats = {
  creditLimit: 2000000, 
  creditUsed: 1250000,  
  balance: 85600.00,    
  rebatePool: 42500.00, 
  ordersPending: 2,
  ordersShipping: 1,
  nextBillDate: '2023-11-05'
};

const ANNOUNCEMENTS: Announcement[] = [
  { id: 4, title: '四川医院准入完成，现开放经销商合作', date: '10-20', tag: '业务', important: true },
  { id: 1, title: '关于 Q4 罗氏芬 (Rocephin) 供货价格调整通知', date: '10-15', tag: '政策', important: true },
  { id: 2, title: '2023年流感季药品储备指导意见书', date: '10-12', tag: '运营', important: false },
  { id: 3, title: 'CIP 系统维护通知：本周六凌晨 02:00-04:00', date: '10-10', tag: '系统', important: false }
];

const INITIAL_ORDERS: Order[] = [
  { 
    id: 'ORD-20231012-01', 
    date: '2023-10-12', 
    amount: 125000, 
    status: '运输中', 
    items: '达菲 (Tamiflu) x500, 罗氏芬 x200', 
    type: 'standard',
    logistics: [
        { time: '10-12 09:30', status: '订单已提交', detail: '经销商提交订单', done: true },
        { time: '10-12 14:00', status: '仓库接单', detail: '成都 RDC 仓库已接单', done: true },
        { time: '10-13 08:00', status: '已出库', detail: '货物已交接给顺丰冷链', done: true },
        { time: '10-13 20:00', status: '运输中', detail: '车辆正前往绵阳分拨中心', done: true },
        { time: '预计明日', status: '送达', detail: '预计 10-14 送达', done: false }
    ]
  },
  { 
    id: 'ORD-20231010-05', 
    date: '2023-10-10', 
    amount: 45000, 
    status: '已签收', 
    items: '安维汀 x10', 
    type: 'standard',
    logistics: [
        { time: '10-10 10:00', status: '订单已提交', done: true },
        { time: '10-11 16:00', status: '已签收', detail: '库管员王某已签收', done: true }
    ]
  },
];

const RECENT_ORDERS: Order[] = [
  { id: 'ORD-20231012-01', date: '2023-10-12', amount: 125000, status: '在途', items: '达菲, 罗氏芬...', type: 'standard' },
  { id: 'ORD-20231010-05', date: '2023-10-10', amount: 45000, status: '已签收', items: '安维汀', type: 'standard' },
];

const INSIGHTS: Insight[] = [
  {
    id: 1,
    type: 'critical',
    title: '检测到高流感活跃度',
    description: '区域疾控中心数据显示，四川流感病例周环比增长 15%。预计奥司他韦需求将激增。',
    icon: Activity,
    color: 'red'
  },
  {
    id: 2,
    type: 'opportunity',
    title: '药品区域趋势预测',
    description: '基于历史销售数据预测流感趋势，建议提前储备抗病毒类药物。',
    icon: TrendingUp,
    color: 'blue',
    actionKey: 'trend_modal'
  }
];

const RAW_PRODUCTS: Product[] = [
  {
    id: 'P001',
    name: '达菲 (奥司他韦) 75mg',
    category: '抗病毒',
    initialStock: 120, 
    burnRateDisplay: '25/天', 
    reason: '疫情激增',
    confidence: 94,
    status: 'Critical',
    price: 185.00,
    calc: {
      avgSales: 10,      
      trendFactor: 2.5,  
      realBurn: 25,      
      safetyDays: 20, 
      strategicBuffer: 150, 
      formula: 'flu'     
    }
  },
  {
    id: 'P002',
    name: '罗氏芬 (头孢曲松)',
    category: '抗生素',
    initialStock: 300,
    burnRateDisplay: '5/天',
    reason: '库存健康',
    confidence: 88,
    status: 'Stable',
    price: 45.00,
    calc: {
      avgSales: 5,
      trendFactor: 1.0,
      realBurn: 5,
      safetyDays: 30,
      strategicBuffer: 0,
      formula: 'stable'
    }
  },
  {
    id: 'P003',
    name: '安维汀 (贝伐珠单抗)',
    category: '肿瘤科',
    initialStock: 12,
    burnRateDisplay: '0.5/天',
    reason: '季节性肿瘤周期',
    confidence: 76,
    status: 'Low',
    price: 3200.00,
    calc: {
      avgSales: 0.5,
      trendFactor: 1.1,
      realBurn: 0.55,
      safetyDays: 45,
      strategicBuffer: 0,
      formula: 'stable'
    }
  }
];

const MULTI_DIMENSIONAL_TRENDS: Record<string, RegionTrendData> = {
  'Sichuan': {
    '达菲': {
      trend: [12, 15, 18, 25, 30, 45, 60, 85, 95, 90, 80, 70, 60, 50, 45],
      prediction: '四川盆地流感爆发，达菲需求预计激增 200%。',
      riskLevel: 'High'
    },
    '罗氏芬': {
      trend: [20, 20, 22, 21, 23, 22, 24, 25, 26, 25, 24, 23, 22, 21, 20],
      prediction: '抗生素需求随流感有轻微上升，整体平稳。',
      riskLevel: 'Medium'
    },
    '安维汀': {
      trend: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      prediction: '肿瘤药物需求稳定，不受季节影响。',
      riskLevel: 'Low'
    }
  },
  'Beijing': {
    '达菲': {
      trend: [10, 11, 10, 12, 13, 15, 14, 16, 18, 17, 16, 15, 14, 13, 12],
      prediction: '北京地区流感活动处于低水平，建议常规备货。',
      riskLevel: 'Low'
    },
    '罗氏芬': {
      trend: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
      prediction: '需求非常稳定。',
      riskLevel: 'Low'
    },
    '安维汀': {
      trend: [8, 8, 8, 9, 8, 8, 8, 8, 8, 9, 8, 8, 8, 8, 8],
      prediction: '重点医院需求稳定。',
      riskLevel: 'Low'
    }
  },
  'Guangdong': {
    '达菲': {
      trend: [20, 22, 25, 28, 30, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58],
      prediction: '南方流感季开启，需求呈爬坡趋势，建议增加库存。',
      riskLevel: 'Medium'
    },
    '罗氏芬': {
      trend: [30, 32, 31, 33, 35, 34, 36, 38, 37, 36, 35, 34, 33, 32, 31],
      prediction: '呼吸道感染增加带动抗生素需求。',
      riskLevel: 'Medium'
    },
    '安维汀': {
      trend: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
      prediction: 'DTP 药房需求稳定。',
      riskLevel: 'Low'
    }
  }
};

const KNOWLEDGE_BASE_DATA: Record<string, { detail: string, gsp: string }> = {
  '达菲': {
    detail: "**达菲 (Tamiflu) 产品详情：**\n\n* **通用名**：磷酸奥司他韦胶囊\n* **规格**：75mg x 10粒/盒\n* **适应症**：用于成人和1岁及1岁以上儿童的甲型和乙型流感治疗；用于成人和13岁及13岁以上青少年的甲型和乙型流感预防。\n* **有效期**：60个月",
    gsp: "**达菲 GSP 存储要求：**\n需密封，在阴凉处（不超过 20℃）保存。请注意防潮。"
  },
  '罗氏芬': {
    detail: "**罗氏芬 (Rocephin) 产品详情：**\n\n* **通用名**：注射用头孢曲松钠\n* **适应症**：用于敏感致病菌所致的下呼吸道感染、尿路、胆道感染等。\n* **有效期**：36个月",
    gsp: "**罗氏芬 GSP 存储要求：**\n遮光，密闭，在阴凉干燥处保存。"
  },
  '安维汀': {
    detail: "**安维汀 (Avastin) 产品详情：**\n\n* **通用名**：贝伐珠单抗注射液\n* **适应症**：转移性结直肠癌、非小细胞肺癌等。\n* **需冷链运输**。",
    gsp: "**安维汀 GSP 存储要求：**\n避光，2-8℃ 冰箱冷藏，不可冷冻。运输过程中需全程冷链监控。"
  }
};

const KNOWLEDGE_BASE: KnowledgeBaseItem[] = [
  {
    keywords: ['折扣', '政策', '返利', '优惠', 'rebate', 'q4', 'Q4'],
    answer: "您目前的 Q4 折扣达成情况如下：\n\n**二级折扣（额外 3% 折扣）：仅差 450 单位。**\n\n建议您结合智能补货清单进行凑单，以锁定此优惠。",
    followUp: "需要为您生成详细的折扣测算表吗？"
  }
];

const QUALIFICATION_DOCS = [
  { id: 1, name: "营业执照 (Business License)", date: "2023-01-01", type: "PDF" },
  { id: 2, name: "药品经营许可证 (Drug Trading License)", date: "2023-05-12", type: "PDF" },
  { id: 3, name: "GSP 认证证书", date: "2023-06-20", type: "PDF" },
  { id: 4, name: "法人授权委托书", date: "2024-01-01", type: "PDF" },
  { id: 5, name: "罗氏制药经销授权书 (2024版)", date: "2024-01-01", type: "PDF", important: true },
];

// --- 3. 辅助组件 ---

const TrendLineChart: React.FC<{ data: number[], color: string }> = ({ data, color }) => (
  <div className="w-full h-48 bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden flex items-end px-4 pb-4 gap-1">
    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
      <div className="w-full h-px bg-slate-400"></div>
      <div className="w-full h-px bg-slate-400"></div>
      <div className="w-full h-px bg-slate-400"></div>
    </div>
    {data.map((val, i) => (
      <div key={i} className="flex-1 relative group flex items-end h-full">
         <div 
           style={{ height: `${val}%` }} 
           className={`w-full rounded-t-sm transition-all duration-500 ${color === 'red' ? 'bg-red-500' : color === 'orange' ? 'bg-orange-500' : 'bg-green-500'} opacity-80`}
         ></div>
         <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
            Day {i+1}: {val}
         </div>
      </div>
    ))}
    <div className="absolute bottom-1 left-4 text-[10px] text-slate-400">今天</div>
    <div className="absolute bottom-1 right-4 text-[10px] text-slate-400">+30 天</div>
  </div>
);

const SimpleLineChart: React.FC = () => (
  <div className="w-full h-40 bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden flex items-end px-4 pb-4 gap-2">
    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
      <div className="w-full h-px bg-slate-400"></div>
      <div className="w-full h-px bg-slate-400"></div>
      <div className="w-full h-px bg-slate-400"></div>
      <div className="w-full h-px bg-slate-400"></div>
    </div>
    <div className="flex-1 flex items-end justify-between h-full pt-8 gap-1">
       {[20, 25, 30, 45, 60, 85, 95].map((h, i) => (
         <div key={i} className="w-full bg-red-100 rounded-t-sm relative group">
           <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-red-500 opacity-80 rounded-t-sm transition-all duration-500"></div>
         </div>
       ))}
    </div>
    <svg className="absolute inset-0 w-full h-full pointer-events-none p-4">
      <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points="0,100 50,110 100,120 150,140 200,160 250,170 300,175" />
    </svg>
  </div>
);

const CalculationBreakdown: React.FC<{ product: Product, stockSource?: 'ddi' | 'manual' }> = ({ product, stockSource }) => {
  if (!product.calc) return null;
  const { realBurn, safetyDays, strategicBuffer } = product.calc;
  const currentStock = product.stock || 0; 
  const demand = Math.ceil(realBurn * safetyDays);
  const gap = demand - currentStock;
  const finalSuggestion = Math.max(0, Math.ceil(gap + strategicBuffer));

  return (
    <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 p-4">
      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
        <Calculator className="h-4 w-4 text-blue-600" />
        AI 计算过程演绎 (基于当前库存)
      </h4>
      <div className="mb-4 pb-4 border-b border-slate-200 border-dashed">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">输入变量</div>
        <div className="flex items-center gap-4 text-sm">
           <div className="flex-1 bg-white border border-slate-200 p-2 rounded">
              <div className="text-slate-500 text-xs">当前库存 ({stockSource === 'manual' ? '自报' : 'DDI'})</div>
              <div className="font-bold text-slate-900">{currentStock}</div>
           </div>
           <div className="flex-1 bg-white border border-slate-200 p-2 rounded">
              <div className="text-slate-500 text-xs">预计消耗 (Est. Burn Rate)</div>
              <div className="font-bold text-red-600">{realBurn}/天</div>
           </div>
        </div>
      </div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">生成建议</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">目标安全库存 ({safetyDays}天)</span>
            <span className="font-mono font-bold">{demand} 单位</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 border-t border-current"></span> 扣除现有库存</span>
            <span className="font-mono font-bold">-{currentStock} 单位</span>
          </div>
          {strategicBuffer > 0 && (
            <div className="flex justify-between items-center text-blue-600 bg-blue-50 p-1.5 rounded -mx-1.5">
              <span className="flex items-center gap-1 font-medium">
                <Zap className="h-3 w-3 fill-current" /> 战略缓冲 (流感+折扣)
              </span>
              <span className="font-mono font-bold">+{strategicBuffer} 单位</span>
            </div>
          )}
          <div className="border-t border-slate-300 pt-2 mt-2 flex justify-between items-center">
            <span className="font-bold text-slate-900">最终建议补货量</span>
            <span className="font-mono font-bold text-xl text-blue-700">{finalSuggestion}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. 业务组件 ---

const CoPilot: React.FC<CoPilotProps> = ({ isOpen, toggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: '您好！我是罗氏智能助手 (Roche Co-pilot)。\n\n请问有什么可以帮您？', options: [
            { label: '达菲 (Tamiflu)', value: '达菲', action: 'select_product' },
            { label: '罗氏芬 (Rocephin)', value: '罗氏芬', action: 'select_product' },
            { label: '安维汀 (Avastin)', value: '安维汀', action: 'select_product' },
          ]}
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleOptionClick = (option: { label: string; value: string; action: string }) => {
    setMessages(prev => [...prev, { type: 'user', text: option.label }]);
    setIsTyping(true);

    setTimeout(() => {
      if (option.action === 'select_product') {
        setSelectedProduct(option.value);
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: `已选择 **${option.value}**。请问您想了解什么？`,
          options: [
            { label: '📦 产品详情', value: 'detail', action: 'ask_detail' },
            { label: '🛡️ GSP合规要求', value: 'gsp', action: 'ask_gsp' },
            { label: '↩️ 重选产品', value: 'reset', action: 'reset' }
          ]
        }]);
      } 
      else if (option.action === 'ask_detail' || option.action === 'ask_gsp') {
         const productKey = selectedProduct || '达菲';
         const data = KNOWLEDGE_BASE_DATA[productKey];
         const answer = option.value === 'detail' ? data.detail : data.gsp;
         setMessages(prev => [...prev, { 
           type: 'bot', 
           text: answer,
           options: [
             { label: '↩️ 返回上一级', value: productKey, action: 'select_product' },
             { label: '🏠 返回主菜单', value: 'main', action: 'reset' }
           ]
         }]);
      }
      else if (option.action === 'reset') {
         setSelectedProduct(null);
         setMessages(prev => [...prev, {
            type: 'bot',
            text: '好的，请选择您关注的产品：',
            options: [
              { label: '达菲 (Tamiflu)', value: '达菲', action: 'select_product' },
              { label: '罗氏芬 (Rocephin)', value: '罗氏芬', action: 'select_product' },
              { label: '安维汀 (Avastin)', value: '安维汀', action: 'select_product' },
            ]
         }]);
      }
      setIsTyping(false);
    }, 600);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { type: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      let response = "抱歉，我暂时无法回答这个问题。建议使用上方按钮选择产品进行查询，或询问‘折扣’。";
      const kbMatch = KNOWLEDGE_BASE.find(item => item.keywords.some(k => userText.toLowerCase().includes(k.toLowerCase())));
      if (kbMatch) {
        response = kbMatch.answer;
        if (kbMatch.followUp) response += `\n\n💡 ${kbMatch.followUp}`;
      } 
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000);
  };
  
  if (!isOpen) return (
    <button onClick={toggle} className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-110 flex items-center justify-center">
      <Bot className="h-8 w-8" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">AI</span>
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-200 animate-in slide-in-from-bottom-10 duration-300 font-sans">
      <div className="bg-blue-700 p-4 rounded-t-2xl flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg"><Bot className="h-5 w-5" /></div>
          <div>
            <div className="font-bold text-sm">Roche Co-pilot</div>
            <div className="text-[10px] text-blue-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online
            </div>
          </div>
        </div>
        <button onClick={toggle} className="hover:bg-blue-600 p-1 rounded transition"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.type === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}`}>
              {msg.text && <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>}
            </div>
            {msg.options && (
                <div className="mt-2 flex flex-wrap gap-2 max-w-[90%]">
                    {msg.options.map((opt, i) => (
                        <button key={i} onClick={() => handleOptionClick(opt)} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition shadow-sm font-medium">
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
              <Loader className="h-4 w-4 animate-spin text-blue-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition">
          <input className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400" placeholder="输入问题..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
          <button onClick={handleSend} disabled={!input.trim()} className={`p-1.5 rounded-full transition ${input.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-300 text-white cursor-not-allowed'}`}>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const RegionalTrendModal: React.FC<RegionalTrendModalProps> = ({ isOpen, onClose }) => {
  const [selectedRegion, setSelectedRegion] = useState('Sichuan');
  const [selectedDrug, setSelectedDrug] = useState('达菲');
  const regionData = MULTI_DIMENSIONAL_TRENDS[selectedRegion][selectedDrug];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
       <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Activity className="h-5 w-5" /></div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">药品区域趋势预测</h3>
                   <p className="text-xs text-slate-500">基于历史销售数据预测流感趋势 (Historical Forecast)</p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="h-5 w-5 text-slate-400" /></button>
          </div>
          <div className="p-6 overflow-y-auto">
             <div className="mb-4">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">选择区域</div>
                <div className="flex gap-2">
                    {Object.keys(MULTI_DIMENSIONAL_TRENDS).map(key => (
                    <button key={key} onClick={() => setSelectedRegion(key)} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${selectedRegion === key ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {key === 'Sichuan' ? '四川' : key === 'Beijing' ? '北京' : '广东'}
                    </button>
                    ))}
                </div>
             </div>
             <div className="mb-6">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">选择药品</div>
                <div className="flex gap-2">
                    {Object.keys(MULTI_DIMENSIONAL_TRENDS['Sichuan']).map(key => (
                    <button key={key} onClick={() => setSelectedDrug(key)} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${selectedDrug === key ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {key}
                    </button>
                    ))}
                </div>
             </div>
             <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                   <h4 className="font-bold text-slate-800 text-sm">未来 30 天需求预测 - {selectedDrug} ({selectedRegion})</h4>
                   <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded font-bold ${regionData.riskLevel === 'High' ? 'bg-red-100 text-red-600' : regionData.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                         风险等级: {regionData.riskLevel}
                      </span>
                   </div>
                </div>
                <TrendLineChart data={regionData.trend} color={regionData.riskLevel === 'High' ? 'red' : regionData.riskLevel === 'Medium' ? 'orange' : 'green'} />
             </div>
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-4">
                <Sparkles className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                   <h5 className="font-bold text-blue-900 text-sm mb-1">AI 策略建议</h5>
                   <p className="text-sm text-blue-800 leading-relaxed">{regionData.prediction}</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const FirstQualificationModal: React.FC<FirstQualificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200">
       <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[80vh]">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">首营资料下载</h3>
                   <p className="text-xs text-slate-500">First Qualification Documents</p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="h-5 w-5 text-slate-400" /></button>
          </div>
          <div className="p-0 overflow-y-auto">
             <div className="divide-y divide-slate-100">
                {QUALIFICATION_DOCS.map((doc) => (
                   <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition group cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="bg-slate-100 p-2 rounded text-slate-500"><FileCheck className="h-5 w-5" /></div>
                         <div>
                            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                               {doc.name}
                               {doc.important && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded">Required</span>}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">更新日期: {doc.date} • {doc.type}</div>
                         </div>
                      </div>
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"><Download className="h-4 w-4" /></button>
                   </div>
                ))}
             </div>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
             <button className="text-sm text-blue-700 font-bold hover:underline">下载全部资料包 (Zip)</button>
          </div>
       </div>
    </div>
  );
};

const HomeView: React.FC<HomeViewProps> = ({ navigateTo, openTrendModal, openQualificationModal }) => {
  const creditPercent = (CIP_STATS.creditUsed / CIP_STATS.creditLimit) * 100;
  const displayInsights = INSIGHTS.map(insight => ({
     ...insight,
     action: insight.actionKey === 'trend_modal' ? openTrendModal : undefined
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="h-24 w-24 text-white" /></div>
          <div className="relative z-10">
            <div className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Credit Facility</div>
            <div className="text-white text-sm font-medium mb-1">信用额度</div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold font-mono">¥ {(CIP_STATS.creditLimit - CIP_STATS.creditUsed).toLocaleString()}</span>
              <span className="text-sm text-blue-200">总额: ¥ {(CIP_STATS.creditLimit / 10000)}万</span>
            </div>
            <div className="w-full bg-blue-900/50 rounded-full h-2 mb-3 border border-blue-500/30">
              <div className={`h-2 rounded-full ${creditPercent > 80 ? 'bg-red-400' : 'bg-green-400'}`} style={{ width: `${creditPercent}%` }}></div>
            </div>
            <div className="flex gap-4 text-xs text-blue-100">
              <div className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${creditPercent > 80 ? 'bg-red-400' : 'bg-green-400'}`}></div> 已用 {(CIP_STATS.creditUsed/10000)}万</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> 账期日: {CIP_STATS.nextBillDate}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">账户余额</div>
            <div className="text-2xl font-bold text-slate-900">¥ {CIP_STATS.balance.toLocaleString()}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Q4 折扣池</span>
              <span className="text-sm font-bold text-green-600">+¥ {CIP_STATS.rebatePool.toLocaleString()}</span>
            </div>
            <button className="text-xs text-blue-700 mt-2 font-medium hover:underline flex items-center gap-1">查看明细 <ChevronRight className="h-3 w-3" /></button>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">订单状态</div>
            <div className="flex justify-around text-center">
              <div className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition">
                <div className="text-xl font-bold text-slate-900">{CIP_STATS.ordersPending}</div>
                <div className="text-xs text-slate-500">待审核</div>
              </div>
              <div className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition">
                <div className="text-xl font-bold text-blue-700">{CIP_STATS.ordersShipping}</div>
                <div className="text-xs text-slate-500">运输中</div>
              </div>
            </div>
          </div>
          <button onClick={() => navigateTo('orders')} className="text-center text-xs text-blue-700 mt-2 font-medium bg-blue-50 py-1.5 rounded hover:bg-blue-100 transition">前往订单中心</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayInsights.map((insight) => (
          <div key={insight.id} onClick={insight.action} className={`bg-white p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${insight.color === 'red' ? 'border-red-500' : 'border-blue-500'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${insight.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}><insight.icon className="h-6 w-6" /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">{insight.title}{insight.action && <ChevronRight className="h-4 w-4 text-slate-400" />}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800 text-sm">最近订单</h3>
               <button onClick={() => navigateTo('orders')} className="text-xs text-blue-700 hover:underline">查看全部</button>
            </div>
            <div className="divide-y divide-slate-100">
               {RECENT_ORDERS.map(order => (
                 <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-bold text-slate-700">{order.id}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${order.status === '在途' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{order.status}</span>
                       </div>
                       <div className="text-xs text-slate-500">{order.items}</div>
                    </div>
                    <div className="text-right">
                       <div className="font-bold text-sm text-slate-900">¥ {order.amount.toLocaleString()}</div>
                       <div className="text-xs text-slate-400">{order.date}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
           <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                 <Megaphone className="h-4 w-4 text-slate-400" />
                 <h3 className="font-bold text-slate-800 text-sm">通知公告</h3>
              </div>
              <ul className="space-y-3">
                 {ANNOUNCEMENTS.map(item => (
                   <li key={item.id} className="cursor-pointer group">
                      <div className="flex justify-between items-start">
                         <span className={`text-xs px-1.5 py-0.5 rounded mr-2 shrink-0 ${item.important ? 'bg-red-50 text-red-600 font-bold' : 'bg-slate-100 text-slate-500'}`}>{item.tag}</span>
                         <span className="text-sm text-slate-600 group-hover:text-blue-700 transition leading-snug">{item.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 text-right mt-1">{item.date}</div>
                   </li>
                 ))}
              </ul>
           </div>
           <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-4">快捷入口</h3>
              <div className="grid grid-cols-2 gap-3">
                 <button className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition group">
                    <FileText className="h-5 w-5 mb-2 text-slate-400 group-hover:text-blue-700" />
                    <span className="text-xs font-medium">我的账单</span>
                 </button>
                 <button onClick={openQualificationModal} className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition group">
                    <ShieldCheck className="h-5 w-5 mb-2 text-slate-400 group-hover:text-blue-700" />
                    <span className="text-xs font-medium">首营资质</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition group">
                    <ArrowRightLeft className="h-5 w-5 mb-2 text-slate-400 group-hover:text-blue-700" />
                    <span className="text-xs font-medium">退货申请</span>
                 </button>
                 <button className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition group">
                    <Download className="h-5 w-5 mb-2 text-slate-400 group-hover:text-blue-700" />
                    <span className="text-xs font-medium">产品目录</span>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const OrdersView: React.FC<OrdersViewProps> = ({ products, cart, navigateTo, orders, onSubmitOrder, onTrackOrder }) => {
  const hasCartItems = cart.length > 0;
  const displayItems = hasCartItems ? cart : products.filter((p: Product) => (p.aiSuggestion || 0) > 0);
  const draftTotalValue = displayItems.reduce((sum: number, p: Product) => sum + (p.price * (hasCartItems ? (p.qty || 0) : (p.aiSuggestion || 0))), 0);
  const draftTotalItems = displayItems.reduce((sum: number, p: Product) => sum + (hasCartItems ? (p.qty || 0) : (p.aiSuggestion || 0)), 0);
  const draftItemNames = displayItems.map((p: Product) => `${p.name.split(' ')[0]} x${hasCartItems ? (p.qty || 0) : (p.aiSuggestion || 0)}`).join(', ');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">订单中心 (Order Center)</h1>
        <p className="text-slate-500">集中管理采购订单、审核 AI 建议草稿并生成正式合同。</p>
      </div>
      <div className="flex gap-6 border-b border-slate-200 mb-6">
        <button className="pb-3 border-b-2 border-blue-700 text-blue-700 font-bold text-sm">全部订单 ({orders.length + (displayItems.length > 0 ? 1 : 0)})</button>
        <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center gap-2">待确认草稿 (Drafts){displayItems.length > 0 && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">1</span>}</button>
      </div>
      <div className="space-y-4">
        {displayItems.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-white border border-amber-200 rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl mt-1 shadow-sm"><FileInput className="h-6 w-6" /></div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{hasCartItems ? '智能补货预采购单' : 'AI 补货建议草稿'}</h3>
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded border border-amber-200">待提交 Pending</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-2 max-w-lg leading-relaxed">系统根据当前库存风险自动生成的建议清单。您尚未确认，建议尽快处理以锁定库存。</div>
                </div>
              </div>
              <div className="text-right bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                <div className="text-xs text-slate-500 mb-1">预计订单总额</div>
                <div className="text-2xl font-bold text-amber-600">¥ {draftTotalValue.toLocaleString()}</div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-5 relative z-10">
              <div className="flex justify-between items-center mb-3">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">商品清单 ({draftTotalItems} 单位)</div>
                 <button onClick={() => navigateTo('replenish')} className="text-xs text-blue-600 hover:underline">修改清单</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {displayItems.map((p: Product) => (
                    <div key={p.id} className="text-sm bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-slate-700 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.status === 'Critical' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                        {p.name.split(' ')[0]} 
                        <span className="font-bold text-slate-900 bg-white px-1.5 rounded border border-slate-200 ml-1">x{hasCartItems ? (p.qty || 0) : (p.aiSuggestion || 0)}</span>
                    </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 relative z-10 justify-end">
               <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition">取消 / 暂存</button>
               <button onClick={() => onSubmitOrder(draftTotalValue, draftItemNames)} className="px-6 py-2.5 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg shadow-blue-200 flex items-center gap-2"><CheckSquare className="h-4 w-4" />确认并提交正式订单</button>
            </div>
          </div>
        )}
        {orders.map((order: Order) => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border border-slate-100 ${order.status === '处理中' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                  {order.status === '处理中' ? <Loader className="h-6 w-6 animate-spin" /> : <FileText className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-slate-900">常规采购订单 (PO)</h3>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${order.status === '运输中' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : order.status === '处理中' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>{order.status}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">ID: {order.id} <span className="mx-1">•</span> {order.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">¥ {order.amount.toLocaleString()}</div>
                <div className="flex items-center justify-end gap-2 mt-2">
                    <button onClick={() => onTrackOrder(order)} className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 px-2 py-1 rounded transition flex items-center gap-1 font-medium"><MapPin className="w-3 h-3" /> 追踪物流</button>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
               <div className="text-sm text-slate-600 truncate max-w-lg"><span className="font-bold text-slate-700 mr-2">包含:</span> {order.items}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SmartReplenishView: React.FC<SmartReplenishViewProps> = ({ cart, addToCart, setShowAnalysis, openAdjustmentModal, inputQuantities, cartTotal, products, navigateTo, toggleStockModal, openTrendModal }) => {
  const rebateProgress = Math.min((cartTotal / 100000) * 100, 100);
  const displayInsights = INSIGHTS.map(insight => ({
     ...insight,
     action: insight.actionKey === 'trend_modal' ? openTrendModal : undefined
  }));

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20 relative">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">SmartConnect 智能补货中心</h1>
            <p className="text-slate-500">AI 驱动的库存优化建议</p>
         </div>
         <button onClick={toggleStockModal} className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-slate-50 hover:text-blue-700 transition">
           <Clipboard className="h-4 w-4" />填报库存
         </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {displayInsights.map((insight) => (
          <div key={insight.id} onClick={insight.action} className={`bg-white p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${insight.color === 'red' ? 'border-red-500' : 'border-blue-500'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${insight.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}><insight.icon className="h-6 w-6" /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">{insight.title}{insight.action && <ChevronRight className="h-4 w-4 text-slate-400" />}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-10">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div><h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Package className="h-5 w-5 text-blue-700" />AI 建议补货清单</h2></div>
          <div className="w-1/3 hidden md:block">
            <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-blue-800">Q4 二级折扣目标</span><span className="text-slate-500">{Math.round(rebateProgress)}%</span></div>
            <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${rebateProgress}%` }}></div></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs">
              <tr><th className="px-6 py-4">产品名称</th><th className="px-6 py-4">库存状态</th><th className="px-6 py-4 text-center">AI 建议量</th><th className="px-6 py-4">推荐理由</th><th className="px-6 py-4 text-right">操作</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product: Product) => {
                const isCritical = product.status === 'Critical';
                const isAdded = cart.some((item: Product) => item.id === product.id);
                const currentQty = inputQuantities[product.id] ?? product.aiSuggestion;
                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4"><div className="font-bold text-slate-900">{product.name}</div></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isCritical ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{product.stock} 单位</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-block bg-blue-50 border border-blue-100 rounded-lg px-3 py-2"><span className="text-lg font-bold text-blue-700">+{product.aiSuggestion}</span></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1"><div className="font-medium text-slate-800">{product.reason}</div></div>
                        <button onClick={() => setShowAnalysis(product)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-400 hover:text-blue-700 transition"><BarChart2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isAdded ? <span className="inline-flex items-center gap-1 text-green-600 font-bold justify-end"><CheckCircle className="h-4 w-4" /> 已暂存</span> : 
                        <div className="flex items-center justify-end gap-3">
                          <div className="flex items-center gap-2"><span className="text-lg font-bold">{currentQty}</span><button onClick={() => openAdjustmentModal(product)} className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-md text-slate-400 hover:text-blue-700 transition shadow-sm"><Edit3 className="h-3.5 w-3.5" /></button></div>
                          <button onClick={() => addToCart(product, currentQty || 0)} className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition">接受</button>
                        </div>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {cart.length > 0 && (
           <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 w-[90%] md:w-auto z-40 animate-in fade-in slide-in-from-bottom-6 duration-300">
              <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-6 border border-slate-700">
                 <div className="flex items-center gap-4"><div className="bg-green-500 rounded-full p-2"><CheckSquare className="h-5 w-5 text-white" /></div><div><div className="text-sm font-medium text-slate-300">已选 {cart.length} 个产品</div><div className="text-xl font-bold">¥ {cartTotal.toLocaleString()}</div></div></div>
                 <button onClick={() => navigateTo('orders')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2">生成预采购单 <ArrowRight className="h-4 w-4" /></button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home'); 
  const [cart, setCart] = useState<Product[]>([]);
  const [showAnalysis, setShowAnalysis] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [tempQty, setTempQty] = useState<number>(0);
  const [inputQuantities, setInputQuantities] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null); 
  const [showTrendModal, setShowTrendModal] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [manualStocks, setManualStocks] = useState<Record<string, number>>({}); 
  const [isCoPilotOpen, setIsCoPilotOpen] = useState(false);

  useEffect(() => {
    const calculatedProducts = RAW_PRODUCTS.map((p: Product) => {
      const currentStock = manualStocks[p.id] !== undefined ? manualStocks[p.id] : p.initialStock;
      const { realBurn, safetyDays, strategicBuffer } = p.calc;
      const newSuggestion = Math.max(0, Math.ceil(realBurn * safetyDays) - currentStock + strategicBuffer);
      return {
        ...p,
        stock: currentStock,
        stockSource: manualStocks[p.id] !== undefined ? 'manual' : 'ddi',
        aiSuggestion: newSuggestion,
        stockoutDate: `${Math.floor(currentStock / realBurn)} 天`
      } as Product;
    });
    setProducts(calculatedProducts);
    const freshInputs: Record<string, number> = {};
    calculatedProducts.forEach((p: Product) => freshInputs[p.id] = p.aiSuggestion || 0);
    setInputQuantities(freshInputs);
  }, [manualStocks]); 

  const handleStockUpdate = (id: string, val: number) => {
    setManualStocks(prev => ({ ...prev, [id]: val }));
  };

  const openAdjustmentModal = (product: Product) => {
    setAdjustingProduct(product);
    setTempQty(inputQuantities[product.id] ?? product.aiSuggestion);
  };

  const saveAdjustment = () => {
    if (adjustingProduct) {
      setInputQuantities(prev => ({ ...prev, [adjustingProduct.id]: tempQty || 0 }));
      setAdjustingProduct(null);
    }
  };

  const addToCart = (product: Product, qty: number) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) setCart(cart.map(item => item.id === product.id ? { ...item, qty: (item.qty || 0) + qty } : item));
    else setCart([...cart, { ...product, qty }]);
  };

  const handleOrderSubmit = (totalAmount: number, itemsSummary: string) => {
    const newOrder: Order = {
        id: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 100)}`,
        date: new Date().toISOString().slice(0,10),
        amount: totalAmount,
        status: '处理中', 
        items: itemsSummary,
        type: 'ai-generated',
        logistics: [ 
            { time: '刚刚', status: '订单已提交', detail: '系统自动审核通过', done: true },
            { time: '处理中', status: '仓库接单中', detail: '等待 RDC 仓库确认', done: false },
        ]
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * (item.qty || 0)), 0);

  const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: React.ElementType }) => (
    <button onClick={() => setCurrentView(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentView === id ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      <Icon className={`h-5 w-5 ${currentView === id ? 'text-blue-700' : 'text-slate-400'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10 font-sans">
        <div className="h-20 flex items-center px-6 border-b border-slate-100 bg-white">
           <div className="bg-blue-800 p-2 rounded-lg mr-3 shadow-sm"><div className="text-white font-bold text-xl leading-none font-serif">R</div></div>
           <div><div className="text-lg font-bold text-slate-900 leading-tight">罗氏 CIP</div><div className="text-[10px] text-slate-400 font-medium mt-0.5">经销商协同平台</div></div>
        </div>
        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-2">CIP 工作台</div>
          <NavItem id="home" label="首页概览" icon={LayoutDashboard} />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-6">核心业务</div>
          <NavItem id="replenish" label="智能补货" icon={Activity} />
          <NavItem id="orders" label="订单中心" icon={Truck} />
          <NavItem id="finance" label="财务与折扣" icon={Wallet} />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-6">支持</div>
          <NavItem id="market" label="市场洞察" icon={PieChart} />
          <NavItem id="help" label="帮助中心" icon={HelpCircle} />
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">陈</div>
            <div className="overflow-hidden"><div className="text-sm font-bold truncate text-slate-800">{USER_PROFILE.name}</div><div className="text-xs text-slate-500 truncate">{USER_PROFILE.company}</div></div>
          </div>
          <div className="flex gap-2 mt-3 px-2">
             <button className="flex-1 text-[10px] text-slate-500 hover:text-blue-700 flex items-center gap-1 justify-center"><LogOut className="w-3 h-3" /> 退出</button>
          </div>
        </div>
      </aside>
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 h-20 sticky top-0 z-20 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-bold text-slate-700 hidden sm:block">{currentView === 'home' ? 'CIP 经销商门户' : currentView === 'replenish' ? '智能补货' : '订单中心'}</h2>
             <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-2 rounded-md border border-slate-100 w-64"><Search className="h-4 w-4" /><span className="text-sm">全站搜索...</span></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer"><Bell className="h-6 w-6 text-slate-500 hover:text-blue-700" /><span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">3</span></div>
            <div className="relative group cursor-pointer flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-100"><ShoppingCart className="h-5 w-5 text-blue-700" /><span className="font-semibold text-blue-800">¥ {cartTotal.toLocaleString()}</span></div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto w-full">
          {currentView === 'home' && <HomeView navigateTo={setCurrentView} openTrendModal={() => setShowTrendModal(true)} openQualificationModal={() => setShowQualificationModal(true)} />}
          {currentView === 'replenish' && <SmartReplenishView cart={cart} addToCart={addToCart} setShowAnalysis={setShowAnalysis} openAdjustmentModal={openAdjustmentModal} inputQuantities={inputQuantities} cartTotal={cartTotal} products={products} navigateTo={setCurrentView} toggleStockModal={() => setIsStockModalOpen(true)} openTrendModal={() => setShowTrendModal(true)} />}
          {currentView === 'orders' && <OrdersView products={products} cart={cart} navigateTo={setCurrentView} orders={orders} onSubmitOrder={handleOrderSubmit} onTrackOrder={setTrackingOrder} />}
        </div>
      </div>
      <CoPilot isOpen={isCoPilotOpen} toggle={() => setIsCoPilotOpen(!isCoPilotOpen)} />
      <RegionalTrendModal isOpen={showTrendModal} onClose={() => setShowTrendModal(false)} />
      <FirstQualificationModal isOpen={showQualificationModal} onClose={() => setShowQualificationModal(false)} />
      {trackingOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                 <div><h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Truck className="h-5 w-5 text-blue-700" />物流追踪</h3><p className="text-xs text-slate-500 mt-1">订单号: {trackingOrder.id}</p></div>
                 <button onClick={() => setTrackingOrder(null)} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="h-5 w-5 text-slate-400" /></button>
              </div>
              <div className="p-8">
                 <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100 mb-8"><div className="p-3 bg-white rounded-lg shadow-sm"><PackageCheck className="h-8 w-8 text-blue-600" /></div><div className="flex-1"><div className="text-sm text-slate-500 mb-1">当前状态</div><div className="text-xl font-bold text-blue-900">{trackingOrder.status}</div></div><div className="text-right"><div className="text-sm text-slate-500 mb-1">预计送达</div><div className="font-bold text-slate-900">2023-10-14</div></div></div>
                 <div className="relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-2 before:bottom-4 before:w-0.5 before:bg-slate-200">
                    {trackingOrder.logistics?.map((step, index) => (
                       <div key={index} className="relative flex gap-6 items-start group"><div className={`absolute left-0 w-6 h-6 rounded-full border-4 z-10 bg-white ${step.done ? 'border-blue-600' : 'border-slate-300'}`}>{step.done && <div className="w-2 h-2 bg-blue-600 rounded-full absolute top-1 left-1"></div>}</div><div className="pl-4 flex-1"><div className="flex justify-between mb-1"><span className={`font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</span><span className="text-xs text-slate-400 font-mono">{step.time}</span></div>{step.detail && <p className="text-sm text-slate-500">{step.detail}</p>}</div></div>
                    ))}
                 </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center"><button onClick={() => setTrackingOrder(null)} className="text-sm text-slate-500 hover:text-slate-800 font-medium">关闭窗口</button></div>
           </div>
        </div>
      )}
      {isStockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div><h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Database className="h-5 w-5 text-blue-600" />手动库存填报</h3><p className="text-xs text-slate-500 mt-1">数据将即时影响 AI 建议。</p></div>
                 <button onClick={() => setIsStockModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="h-5 w-5 text-slate-400" /></button>
              </div>
              <div className="p-0 overflow-y-auto flex-1">
                 <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0">
                       <tr><th className="px-5 py-3 font-medium">产品</th><th className="px-5 py-3 font-medium text-center">系统记录 (DDI)</th><th className="px-5 py-3 font-medium text-right">实际库存</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {products.map((p: Product) => (
                          <tr key={p.id}><td className="px-5 py-4 font-medium text-slate-900">{p.name}</td><td className="px-5 py-4 text-center text-slate-400">{p.initialStock}</td><td className="px-5 py-4 text-right"><div className="flex justify-end"><input type="number" className="w-24 border border-slate-300 rounded px-2 py-1 text-right font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" value={p.stock} onChange={(e) => handleStockUpdate(p.id, parseInt(e.target.value) || 0)} /></div></td></tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center"><span className="text-xs text-slate-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" />保存后 AI 将立即重算建议</span><button onClick={() => setIsStockModalOpen(false)} className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-sm flex items-center gap-2"><RefreshCw className="h-4 w-4" />更新并重算</button></div>
           </div>
        </div>
      )}
      {adjustingProduct && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center"><h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Edit3 className="h-5 w-5 text-amber-500" />调整订货量</h3><button onClick={() => setAdjustingProduct(null)} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="h-5 w-5 text-slate-400" /></button></div>
               <div className="p-6">
                  <div className="mb-6"><div className="text-sm text-slate-500 mb-1">产品名称</div><div className="font-bold text-slate-900 text-lg">{adjustingProduct.name}</div><div className="text-xs text-slate-400 mt-1">当前库存: {adjustingProduct.stock}</div></div>
                  <div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-blue-50 border border-blue-100 p-4 rounded-xl"><div className="text-xs text-blue-600 font-bold uppercase mb-1">AI 建议量</div><div className="text-2xl font-bold text-blue-700">{adjustingProduct.aiSuggestion}</div></div><div className="bg-slate-50 border border-slate-200 p-4 rounded-xl"><div className="text-xs text-slate-500 font-bold uppercase mb-1">当前设定</div><div className="text-2xl font-bold text-slate-700">{tempQty}</div></div></div>
                  <div className="space-y-4">
                     <div><label className="block text-sm font-medium text-slate-700 mb-2">手动输入数量</label><div className="flex items-center gap-2"><button onClick={() => setTempQty(prev => Math.max(0, prev - 10))} className="p-3 border rounded-lg hover:bg-slate-50 font-bold text-slate-500">-</button><input type="number" value={tempQty} onChange={(e) => setTempQty(parseInt(e.target.value) || 0)} className="flex-1 p-3 border border-slate-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none" /><button onClick={() => setTempQty(prev => prev + 10)} className="p-3 border rounded-lg hover:bg-slate-50 font-bold text-slate-500">+</button></div></div>
                     <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg text-sm"><span className="text-slate-500 flex items-center gap-2"><Calculator className="h-4 w-4" /> 预计总额</span><span className="font-bold text-slate-900">¥ {(tempQty * adjustingProduct.price).toLocaleString()}</span></div>
                  </div>
               </div>
               <div className="p-6 border-t border-slate-100 flex gap-3"><button onClick={() => setAdjustingProduct(null)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition">取消</button><button onClick={saveAdjustment} className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition">保存</button></div>
            </div>
         </div>
      )}
      {showAnalysis && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div><h3 className="text-xl font-bold text-slate-900">AI 分析报告: {showAnalysis.name}</h3><p className="text-sm text-slate-500">模型: 趋势预测 (v4.2)</p></div>
              <button onClick={() => setShowAnalysis(null)} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="flex gap-8 mb-6">
                <div className="flex-1"><div className="text-sm text-slate-500 mb-1">当前库存</div><div className="text-2xl font-bold text-slate-900">{showAnalysis.stock} 单位</div></div>
                <div className="flex-1"><div className="text-sm text-slate-500 mb-1">消耗速率</div><div className="text-2xl font-bold text-red-600">{showAnalysis.burnRateDisplay}</div></div>
                <div className="flex-1"><div className="text-sm text-slate-500 mb-1">建议订货量</div><div className="text-2xl font-bold text-blue-600">+{showAnalysis.aiSuggestion}</div></div>
              </div>
              <div className="mb-6"><h4 className="font-semibold text-slate-800 mb-3 text-sm">趋势可视化</h4><SimpleLineChart /></div>
              <CalculationBreakdown product={showAnalysis} stockSource={showAnalysis.stockSource} />
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3"><button onClick={() => setShowAnalysis(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition">关闭</button><button onClick={() => { addToCart(showAnalysis, showAnalysis.aiSuggestion || 0); setShowAnalysis(null); }} className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition">确认推荐</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
