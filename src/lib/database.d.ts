export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      distrito: {
        Row: {
          coords: number[]
          description: string
          id: number
          main_image: string | null
          name: string
        }
        Insert: {
          coords: number[]
          description?: string
          id?: number
          main_image?: string | null
          name: string
        }
        Update: {
          coords?: number[]
          description?: string
          id?: number
          main_image?: string | null
          name?: string
        }
        Relationships: []
      }
      distrito_favoritos: {
        Row: {
          created_at: string
          distrito_id: number | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          distrito_id?: number | null
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          distrito_id?: number | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'distrito_favoritos_distrito_id_fkey'
            columns: ['distrito_id']
            isOneToOne: false
            referencedRelation: 'distrito'
            referencedColumns: ['id']
          }
        ]
      }
      distrito_imagenes: {
        Row: {
          distrito_id: number
          id: number
          url: string
        }
        Insert: {
          distrito_id: number
          id?: number
          url: string
        }
        Update: {
          distrito_id?: number
          id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'distrito_imagenes_distrito_id_fkey'
            columns: ['distrito_id']
            isOneToOne: false
            referencedRelation: 'distrito'
            referencedColumns: ['id']
          }
        ]
      }
      eventos: {
        Row: {
          description: string | null
          distrito_id: number
          end_date: string | null
          id: number
          start_date: string
          subject: string
        }
        Insert: {
          description?: string | null
          distrito_id: number
          end_date?: string | null
          id?: number
          start_date: string
          subject: string
        }
        Update: {
          description?: string | null
          distrito_id?: number
          end_date?: string | null
          id?: number
          start_date?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: 'eventos_distrito_id_fkey'
            columns: ['distrito_id']
            isOneToOne: false
            referencedRelation: 'distrito'
            referencedColumns: ['id']
          }
        ]
      }
      punto_interes_favoritos: {
        Row: {
          created_at: string
          id: number
          punto_de_interes_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          punto_de_interes_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          punto_de_interes_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'punto_interes_favoritos_punto_de_interes_id_fkey'
            columns: ['punto_de_interes_id']
            isOneToOne: false
            referencedRelation: 'puntos_de_interes'
            referencedColumns: ['id']
          }
        ]
      }
      puntos_de_interes: {
        Row: {
          address_reference: string | null
          coords: number[]
          description: string | null
          distrito_id: number
          id: number
          name: string
          tipo: string
        }
        Insert: {
          address_reference?: string | null
          coords: number[]
          description?: string | null
          distrito_id: number
          id?: number
          name: string
          tipo?: string
        }
        Update: {
          address_reference?: string | null
          coords?: number[]
          description?: string | null
          distrito_id?: number
          id?: number
          name?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: 'puntos_de_interes_distrito_id_fkey'
            columns: ['distrito_id']
            isOneToOne: false
            referencedRelation: 'distrito'
            referencedColumns: ['id']
          }
        ]
      }
      puntos_de_interes_comentarios: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          punto_de_interes_id: number
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          punto_de_interes_id: number
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          punto_de_interes_id?: number
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'puntos_de_interes_comentarios_punto_de_interes_id_fkey'
            columns: ['punto_de_interes_id']
            isOneToOne: false
            referencedRelation: 'puntos_de_interes'
            referencedColumns: ['id']
          }
        ]
      }
      puntos_de_interes_contactos: {
        Row: {
          created_at: string
          id: number
          instagram_user: string | null
          phone_number: number[]
          punto_de_interes_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          instagram_user?: string | null
          phone_number: number[]
          punto_de_interes_id: number
        }
        Update: {
          created_at?: string
          id?: number
          instagram_user?: string | null
          phone_number?: number[]
          punto_de_interes_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'puntos_de_interes_contactos_punto_de_interes_id_fkey'
            columns: ['punto_de_interes_id']
            isOneToOne: false
            referencedRelation: 'puntos_de_interes'
            referencedColumns: ['id']
          }
        ]
      }
      puntos_de_interes_imagenes: {
        Row: {
          id: number
          punto_de_interes_id: number
          url: string
        }
        Insert: {
          id?: number
          punto_de_interes_id: number
          url: string
        }
        Update: {
          id?: number
          punto_de_interes_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'puntos_de_interes_imagenes_punto_de_interes_id_fkey'
            columns: ['punto_de_interes_id']
            isOneToOne: false
            referencedRelation: 'puntos_de_interes'
            referencedColumns: ['id']
          }
        ]
      }
      roles_de_usuario: {
        Row: {
          id: number
          role: Database['public']['Enums']['app_role'] | null
          user_id: string
        }
        Insert: {
          id?: number
          role?: Database['public']['Enums']['app_role'] | null
          user_id?: string
        }
        Update: {
          id?: number
          role?: Database['public']['Enums']['app_role'] | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: 'admin' | 'editor' | 'viewer'
      point_type:
        | 'alojamiento'
        | 'turistico'
        | 'historico'
        | 'cine'
        | 'gastronomia'
        | 'otro'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
