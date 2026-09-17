export interface ClaimEntity {
  id: string;
  name: string;
  description?: string;
  id_user: string;
  id_character_role?: string;
  id_status: string;
  id_category: string;
  nb_refus: number;
}