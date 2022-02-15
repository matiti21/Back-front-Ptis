class BitacoraRevision < ApplicationRecord
  belongs_to :motivo
  belongs_to :minuta
  has_one :tema
  has_many :items
  has_many :conclusiones
  has_many :objetivos
  has_many :comentarios
  has_many :aprobaciones
  before_save :revision_mayuscula

  # Validaciones
  validates :revision, format: {with: /\A([A-Z0-9]{1})\z/}, presence: true
  validates :emitida, inclusion: {in: [true, false]}

  private
  def revision_mayuscula
    self.revision = self.revision.to_s.upcase
  end
end
