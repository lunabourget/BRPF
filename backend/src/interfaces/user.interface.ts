export interface UserEntity {
  id: string;
  name: string;
  surname?: string;
  email: string;
  password?: string;
  fictive_work?: string;
  year?: number | undefined;
  id_character_role?: string;
  id_media?: string;
  author?: string;
}