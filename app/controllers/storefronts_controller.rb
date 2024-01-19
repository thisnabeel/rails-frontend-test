class StorefrontsController < ApplicationController
  before_action :set_storefront, only: %i[ show edit update destroy edit_reason]
  skip_before_action :verify_authenticity_token, only: [:save_draft]

  # GET /storefronts or /storefronts.json
  def index
    @storefronts = Storefront.all
  end

  # GET /storefronts/1 or /storefronts/1.json
  def show
  end

  # GET /storefronts/new
  def new
    @storefront = Storefront.new
  end

  # GET /storefronts/1/edit
  def edit
    session[:drafting_reasons] = nil
  end

  def edit_reason
    list = session[:drafting_reasons]&.map { |r| Reason.new(r) }
    @reason = list&.find { |reason| reason[:id] == params[:reason_id].to_i } || @storefront.reasons.find(params[:reason_id])
    render turbo_stream: 
      turbo_stream.update("edit-reason-modal", 
        partial: "storefronts/modal", 
        locals: { reason: @reason, storefront: @storefront }
      )
  end

  def save_draft

    reason_params = params[:reason]
    storefront_id = reason_params[:storefront_id]

    @storefront = Storefront.find(storefront_id)
    drafting_reasons = load_drafting_reasons(storefront_id)

    updated_drafting_reasons = drafting_reasons.map.with_index do |reason, index|
      update_reason_attributes(reason, reason_params) if reason.id == reason_params[:id].to_i && reason_params
      reason
    end

    session[:drafting_reasons] = updated_drafting_reasons

    render turbo_stream: 
      turbo_stream.update("reasons-list", 
        partial: "storefronts/reasons", 
        locals: { 
          reasons: updated_drafting_reasons,
          storefront: @storefront
        }
      )
  end

  def publish_draft
    session[:drafting_reasons]&.each_with_index do |r, index| 
      reason = Reason.find_or_create_by(id: r["id"])
      puts reason.attributes
      puts r[:code]
      reason.update!(r)
    end
    render json: Storefront.find(params[:id]).reasons.ordered
  end


  # POST /storefronts or /storefronts.json
  def create
    @storefront = Storefront.new(storefront_params)

    respond_to do |format|
      if @storefront.save
        format.html { redirect_to storefront_url(@storefront), notice: "Storefront was successfully created." }
        format.json { render :show, status: :created, location: @storefront }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @storefront.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /storefronts/1 or /storefronts/1.json
  def update
    respond_to do |format|
      if @storefront.update(storefront_params)
        format.html { redirect_to [:edit, @storefront], notice: "Storefront was successfully updated." }
        format.json { render :edit, status: :ok, location: @storefront }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @storefront.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /storefronts/1 or /storefronts/1.json
  def destroy
    @storefront.destroy!

    respond_to do |format|
      format.html { redirect_to storefronts_url, notice: "Storefront was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

    def load_drafting_reasons(storefront_id)
      session[:drafting_reasons]&.map { |r| Reason.new(r) } || @storefront.reasons.order(params[:reasons_order])
    end

    def update_reason_attributes(reason, params)
      reason.assign_attributes(
        label: params[:label],
        code: params[:code],
        active: params[:active]
      )
    end
    # Use callbacks to share common setup or constraints between actions.
    def set_storefront
      @storefront = Storefront.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def storefront_params
      params.fetch(:storefront, {}).permit(
      :name,
        {
          reasons_attributes: [
            :id,
            :code,
            :label,
            :ordering,
            :active,
            :_destroy,
            { restricted_resolution_types: [] }
          ]
        }
      )
    end
end
