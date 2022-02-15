class CreateTipoEstados < ActiveRecord::Migration[6.0]
  def change
    create_table :tipo_estados do |t|
      t.string :abreviacion, unique: true
      t.string :descripcion
      t.boolean :borrado, default: false
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
