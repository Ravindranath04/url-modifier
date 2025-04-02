
import { toast } from "sonner";

export type SecurityCheckResult = {
  safe: boolean;
  threats: string[];
  source: string;
};

// Interface for security check providers
export interface SecurityProvider {
  name: string;
  checkUrl: (url: string) => Promise<SecurityCheckResult>;
}

// Google Safe Browsing API provider
class GoogleSafeBrowsingProvider implements SecurityProvider {
  name = "Google Safe Browsing";
  
  async checkUrl(url: string): Promise<SecurityCheckResult> {
    try {
      // For demo purposes, we're using a simplified check
      // In a production app, you would use the actual Google Safe Browsing API
      const hostname = new URL(url).hostname.toLowerCase();
      
      // Simple check for demonstration purposes
      const isSuspicious = hostname.includes('phishing') || 
                          hostname.includes('malware') || 
                          hostname.includes('suspicious');
      
      return {
        safe: !isSuspicious,
        threats: isSuspicious ? ["Suspicious domain detected"] : [],
        source: "Google Safe Browsing API (simulated)"
      };
    } catch (error) {
      console.error("Error in Google Safe Browsing check:", error);
      return {
        safe: false,
        threats: ["Unable to verify URL safety"],
        source: "Google Safe Browsing API (error)"
      };
    }
  }
}

// VirusTotal API provider
class VirusTotalProvider implements SecurityProvider {
  name = "VirusTotal";
  
  async checkUrl(url: string): Promise<SecurityCheckResult> {
    try {
      // For demo purposes, we're using a simplified check
      // In a production app, you would use the actual VirusTotal API
      const hostname = new URL(url).hostname.toLowerCase();
      
      // Simple check for demonstration purposes
      const isSuspicious = hostname.includes('virus') || 
                          hostname.includes('trojan') || 
                          hostname.includes('hack');
      
      return {
        safe: !isSuspicious,
        threats: isSuspicious ? ["Potential malware detected"] : [],
        source: "VirusTotal API (simulated)"
      };
    } catch (error) {
      console.error("Error in VirusTotal check:", error);
      return {
        safe: false,
        threats: ["Unable to verify URL safety"],
        source: "VirusTotal API (error)"
      };
    }
  }
}

// PhishTank API provider
class PhishTankProvider implements SecurityProvider {
  name = "PhishTank";
  
  async checkUrl(url: string): Promise<SecurityCheckResult> {
    try {
      // For demo purposes, we're using a simplified check
      // In a production app, you would use the actual PhishTank API
      const hostname = new URL(url).hostname.toLowerCase();
      
      // Simple check for demonstration purposes
      const isSuspicious = hostname.includes('phish') || 
                          hostname.includes('scam') || 
                          hostname.includes('fake');
      
      return {
        safe: !isSuspicious,
        threats: isSuspicious ? ["Potential phishing site detected"] : [],
        source: "PhishTank API (simulated)"
      };
    } catch (error) {
      console.error("Error in PhishTank check:", error);
      return {
        safe: false,
        threats: ["Unable to verify URL safety"],
        source: "PhishTank API (error)"
      };
    }
  }
}

// Custom AI approach (simplified simulation)
class CustomAIProvider implements SecurityProvider {
  name = "Custom AI";
  
  async checkUrl(url: string): Promise<SecurityCheckResult> {
    try {
      // In a real implementation, this would use a trained model
      // For demo, we'll use a simple heuristic approach
      const hostname = new URL(url).hostname.toLowerCase();
      const path = new URL(url).pathname.toLowerCase();
      
      // Check for suspicious patterns (simplified for demo)
      const suspiciousPatterns = [
        'login', 'secure', 'account', 'banking', 'verify',
        'paypal', 'ebay', 'amazon', 'microsoft', 'apple',
        'password', 'update', 'alert', 'verify', 'wallet'
      ];
      
      const matchedPatterns = suspiciousPatterns.filter(
        pattern => hostname.includes(pattern) || path.includes(pattern)
      );
      
      const isSuspicious = matchedPatterns.length >= 2; // If 2+ patterns match
      
      return {
        safe: !isSuspicious,
        threats: isSuspicious ? ["AI model detected suspicious patterns"] : [],
        source: "Custom AI Model (TF-IDF + Logistic Regression simulation)"
      };
    } catch (error) {
      console.error("Error in Custom AI check:", error);
      return {
        safe: false,
        threats: ["Unable to verify URL safety"],
        source: "Custom AI (error)"
      };
    }
  }
}

// URL Security Service that uses multiple providers
export class UrlSecurityService {
  private providers: SecurityProvider[] = [
    new GoogleSafeBrowsingProvider(),
    new VirusTotalProvider(),
    new PhishTankProvider(),
    new CustomAIProvider()
  ];
  
  async checkUrlSafety(url: string): Promise<SecurityCheckResult[]> {
    try {
      // Check with all providers
      const results = await Promise.all(
        this.providers.map(provider => provider.checkUrl(url))
      );
      
      return results;
    } catch (error) {
      console.error("Error checking URL safety:", error);
      toast.error("Failed to check URL safety");
      return [{
        safe: false,
        threats: ["Failed to check URL safety"],
        source: "Security Service Error"
      }];
    }
  }
  
  isUrlSafe(results: SecurityCheckResult[]): boolean {
    // URL is considered safe if all providers report it as safe
    return results.every(result => result.safe);
  }
  
  getAllThreats(results: SecurityCheckResult[]): string[] {
    // Collect all threats from all providers
    return results.flatMap(result => result.threats);
  }
}

// Export a singleton instance
export const urlSecurityService = new UrlSecurityService();
