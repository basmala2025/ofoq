export interface AIMovement {
  direction: 'left' | 'right' | 'up' | 'down';
  duration: number;
  timestamp: string;
}

export interface AIResult {
  total_left_looks: number;
  total_right_looks: number;
  total_up_looks: number;
  total_down_looks: number;
  total_movements: number;
  movements: AIMovement[];
  is_suspicious?: boolean;
}
