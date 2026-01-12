export type AlertType = 'success' | 'error' | 'warning'| 'vms'| 'pa' | 'atcs' | 'parking'|'info';


export interface Alert {
  id?: number;
  message: string;
  type: AlertType;
  duration?: number;          // auto close (ms)
  bgColor?: string;           // user-defined background
  textColor?: string; 

   
         // user-defined text color
}
