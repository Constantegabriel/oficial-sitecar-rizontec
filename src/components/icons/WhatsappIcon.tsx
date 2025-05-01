
import { MessageCircle } from "lucide-react";

export const WhatsappIcon = (props: React.ComponentProps<typeof MessageCircle>) => {
  return <MessageCircle {...props} color={props.color || "#25D366"} />;
};
