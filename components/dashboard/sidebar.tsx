"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  UserCheck, 
  Building2, 
  CreditCard, 
  FileText, 
  DollarSign, 
  RotateCcw, 
  Server, 
  StickyNote,
  Monitor,
  Calendar,
  ChevronDown,
  X
} from "lucide-react";
import { useState } from "react";
import { LogoutButton } from "@/components/logout-button";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    name: "Customer",
    href: "/dashboard/customers",
    icon: UserCheck,
    children: [
      { name: "All Customers", href: "/dashboard/customers" },
      { name: "Add Customer", href: "/dashboard/customers/new" },
    ]
  },
  {
    name: "Reseller",
    href: "/dashboard/resellers",
    icon: Building2,
    children: [
      { name: "All Resellers", href: "/dashboard/resellers" },
      { name: "Add Reseller", href: "/dashboard/resellers/new" },
    ]
  },
  {
    name: "Subscription",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
    children: [
      { name: "All Subscriptions", href: "/dashboard/subscriptions" },
      { name: "Add Subscription", href: "/dashboard/subscriptions/new" },
    ]
  },
  {
    name: "Invoicing",
    href: "/dashboard/invoices",
    icon: FileText,
    children: [
      { name: "All Invoices", href: "/dashboard/invoices" },
      { name: "Create Invoice", href: "/dashboard/invoices/new" },
    ]
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: DollarSign,
    children: [
      { name: "All Transactions", href: "/dashboard/transactions" },
      { name: "Add Transaction", href: "/dashboard/transactions/new" },
    ]
  },

  {
    name: "Refunds",
    href: "/dashboard/refunds",
    icon: RotateCcw,
    children: [
      { name: "All Refunds", href: "/dashboard/refunds" },
      { name: "Add Refund", href: "/dashboard/refunds/new" },
    ]
  },
 
  {
    name: "Notes",
    href: "/dashboard/notes",
    icon: StickyNote,
    children: [
      { name: "All Notes", href: "/dashboard/notes" },
      { name: "Add Note", href: "/dashboard/notes/new" },
    ]
  },
  {
    name: "Absence",
    href: "/dashboard/absence",
    icon: Calendar,
    children: [
      { name: "All Absences", href: "/dashboard/absence" },
      { name: "Add Absence", href: "/dashboard/absence/new" },
    ]
  },
  {
    name: "Servers",
    href: "/dashboard/servers",
    icon: Server,
    children: [
      { name: "All Servers", href: "/dashboard/servers" },
      { name: "Add Server", href: "/dashboard/servers/new" },
    ]
  },
  {
    name: "Platforms",
    href: "/dashboard/platforms",
    icon: Monitor,
  },


];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="FiooTV Logo" 
                width={100}
                height={28}
                className="h-[28px] object-contain dark:invert brightness-0"
              />
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.children && item.children.some(child => pathname === child.href));
          const isExpanded = expandedItems.includes(item.name);

          return (
            <div key={item.name}>
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "text-white font-bold bg-slate-800"
                    : "text-gray-300 hover:text-white"
                )}
                onClick={() => item.children ? toggleExpanded(item.name) : null}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  {item.href ? (
                    <Link href={item.href} className="flex-1" onClick={onClose}>
                      {item.name}
                    </Link>
                  ) : (
                    <span className="flex-1">{item.name}</span>
                  )}
                </div>
                {item.children && (
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded && "rotate-180"
                    )} 
                  />
                )}
              </div>

              {/* Submenu */}
              {item.children && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className={cn(
                        "block px-3 py-2 rounded-lg text-sm transition-colors",
                        pathname === child.href
                          ? "text-white font-bold"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
