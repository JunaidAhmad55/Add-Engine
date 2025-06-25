import { Link, Copyright, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { slackService } from "@/lib/services/slack-service";

const currentYear = new Date().getFullYear();

const footerLinks = [
  {
    label: "Privacy Policy",
    href: "#",
  },
  {
    label: "Terms",
    href: "#",
  },
  {
    label: "Contact",
    href: "#support", // We'll use this as an anchor for opening the support dialog
  },
];

const Footer = () => {
  const [showSupport, setShowSupport] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) {
      toast({
        title: "Message required",
        description: "Please enter your support message.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      const text = `:sos: *Support Request*${supportEmail ? `\nEmail: ${supportEmail}` : ""}\nMessage: ${supportMsg}`;
      await slackService.sendSupportNotification(text);
      toast({
        title: "Support request sent",
        description: "We've sent your message to our support team.",
      });
      setShowSupport(false);
      setSupportMsg("");
      setSupportEmail("");
    } catch {
      toast({
        title: "Failed to send",
        description: "Could not send to support. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="w-full relative mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-5 border-t border-gray-200 bg-white/95 rounded-t-lg shadow-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <Copyright className="h-4 w-4 mr-1" />
          <span className="font-semibold text-gray-700">
            {currentYear} Jaq Group&nbsp;
          </span>
          <span className="text-xs text-gray-500">— All Rights Reserved</span>
        </div>
        <nav className="flex items-center gap-2 md:gap-4">
          {footerLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-gray-500 hover:text-[#20B153] text-sm font-medium transition-colors"
              onClick={e => {
                if (link.label === "Contact") {
                  e.preventDefault();
                  setShowSupport(true);
                }
              }}
            >
              <Link className="h-3 w-3 inline -mt-0.5" />
              {link.label}
            </a>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 items-center text-primary ml-2"
          onClick={() => setShowSupport(true)}
        >
          <MessageCircle className="h-4 w-4" />Contact Support
        </Button>
      </div>
      <div className="mb-2 w-full flex justify-center">
        <span className="text-xs text-gray-400 tracking-widest">Built with ❤️ by the Jaq Group team</span>
      </div>
      <Dialog open={showSupport} onOpenChange={setShowSupport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSupport} className="space-y-4">
            <Input
              type="email"
              placeholder="Your email (optional, for response)"
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
            />
            <Textarea
              rows={3}
              placeholder="How can we help you?"
              value={supportMsg}
              onChange={e => setSupportMsg(e.target.value)}
              required
            />
            <DialogFooter>
              <Button type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send to Support"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
