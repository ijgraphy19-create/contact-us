// Photography Inquiry Form Application
class PhotographyInquiryForm {
    constructor() {
        this.currentStep = 0;
        this.selectedEvent = null;
        this.formData = {};
        this.eventTimelineItems = [];
        this.totalSteps = 4;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
    }

    bindEvents() {
        // Event type selection
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectEventType(e));
        });

        // Form navigation
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
        if (submitBtn) submitBtn.addEventListener('click', (e) => this.submitForm(e));

        // Form submission
        const inquiryForm = document.getElementById('inquiryForm');
        if (inquiryForm) {
            inquiryForm.addEventListener('submit', (e) => this.submitForm(e));
        }

        // Dynamic timeline management - use event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-timeline-btn')) {
                e.preventDefault();
                this.addTimelineItem();
            }
            if (e.target.classList.contains('remove-timeline-btn')) {
                e.preventDefault();
                this.removeTimelineItem(e.target.closest('.timeline-item'));
            }
        });

        // Service selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'services') {
                this.updateServiceSelection(e.target);
            }
        });

        // Brand logo click to go back to welcome
        const brand = document.querySelector('.brand');
        if (brand) {
            brand.addEventListener('click', () => {
                this.resetForm();
            });
        }
    }

    selectEventType(e) {
        const eventType = e.currentTarget.dataset.event;
        this.selectedEvent = eventType;

        // Visual feedback
        document.querySelectorAll('.event-card').forEach(card => {
            card.classList.remove('selected');
        });
        e.currentTarget.classList.add('selected');

        // Generate dynamic form content
        setTimeout(() => {
            this.generateEventForm(eventType);
            this.showFormSection();
            this.showProgress();
        }, 300);
    }

    generateEventForm(eventType) {
        const dynamicContent = document.getElementById('dynamicContent');
        let formHTML = '';

        // Step 1: Basic Information
        formHTML += this.generateBasicInfoStep(eventType);

        // Step 2: Event Details
        formHTML += this.generateEventDetailsStep(eventType);

        // Step 3: Services Selection
        formHTML += this.generateServicesStep();

        // Step 4: Review & Contact
        formHTML += this.generateReviewStep();

        dynamicContent.innerHTML = formHTML;

        // Show first step
        this.showStep(0);
        this.updateNavigation();
    }

    generateBasicInfoStep(eventType) {
        const descriptions = {
            'Wedding': 'Tell us about your special day so we can capture every precious moment of your love story',
            'Engagement': 'Share your engagement details to help us create beautiful memories of this exciting milestone',
            'Birthday Party': 'Help us understand your celebration so we can capture all the joy and special moments',
            'Naming Ceremony': 'Share details about this precious ceremony so we can document this important family milestone',
            'Baby Shower': 'Tell us about your celebration so we can capture the love and excitement surrounding your new arrival',
            'Corporate Event': 'Provide your event details so we can deliver professional photography that represents your brand',
            'Concert': 'Share your event information so we can capture the energy and excitement of your performance',
            'House Warming': 'Tell us about your celebration so we can document this special milestone in your new home',
            'Anniversary': 'Share your anniversary details so we can capture the love and memories you\'ve built together',
            'Graduation': 'Help us understand your achievement celebration so we can capture this important milestone',
            'Family Portrait': 'Share your family session preferences so we can create beautiful portraits you\'ll treasure forever'
        };

        return `
        <div class="form-step active" data-step="0">
            <h3 class="step-title">Basic Information</h3>
            <p class="step-description">${descriptions[eventType] || 'Tell us about your special event so we can capture every important moment'}</p>

            <div class="form-row">
                <div class="form-group">
                    <label for="clientName">Your Name *</label>
                    <p class="field-description">How should we address you during our correspondence?</p>
                    <input type="text" id="clientName" name="clientName" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="clientEmail">Email Address *</label>
                    <p class="field-description">We'll use this to send you our personalized proposal</p>
                    <input type="email" id="clientEmail" name="clientEmail" class="form-control" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="clientPhone">Phone Number *</label>
                    <p class="field-description">For quick coordination and consultation scheduling</p>
                    <input type="tel" id="clientPhone" name="clientPhone" class="form-control" required>
                </div>

                <div class="form-group">
                    <label for="eventDate">Event Date *</label>
                    <p class="field-description">When is your special ${eventType.toLowerCase()} taking place?</p>
                    <input type="date" id="eventDate" name="eventDate" class="form-control" required>
                </div>
            </div>

            <div class="form-group">
                <label for="eventVenue">Event Venue *</label>
                <p class="field-description">Where will your ${eventType.toLowerCase()} be held? Include the full address if possible</p>
                <input type="text" id="eventVenue" name="eventVenue" class="form-control" required>
            </div>

            ${eventType === 'Wedding' ? this.getWeddingSpecificBasicFields() : ''}
            ${eventType === 'Birthday Party' ? this.getBirthdaySpecificBasicFields() : ''}
            ${eventType === 'Baby Shower' ? this.getBabyShowerSpecificBasicFields() : ''}
        </div>`;
    }

    getWeddingSpecificBasicFields() {
        return `
        <div class="form-row">
            <div class="form-group">
                <label for="partnerName">Partner's Name *</label>
                <p class="field-description">Your beloved's name for our records</p>
                <input type="text" id="partnerName" name="partnerName" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="weddingType">Wedding Style</label>
                <p class="field-description">What type of wedding celebration are you planning?</p>
                <select id="weddingType" name="weddingType" class="form-control">
                    <option value="">Select wedding style</option>
                    <option value="Traditional Hindu">Traditional Hindu</option>
                    <option value="Christian">Christian</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Destination">Destination Wedding</option>
                    <option value="Court Marriage">Court Marriage</option>
                    <option value="Mixed Culture">Mixed Culture</option>
                    <option value="Other">Other</option>
                </select>
            </div>
        </div>`;
    }

    getBirthdaySpecificBasicFields() {
        return `
        <div class="form-row">
            <div class="form-group">
                <label for="birthdayPerson">Birthday Person's Name</label>
                <p class="field-description">Who is the star of this celebration?</p>
                <input type="text" id="birthdayPerson" name="birthdayPerson" class="form-control">
            </div>

            <div class="form-group">
                <label for="birthdayAge">Age Milestone</label>
                <p class="field-description">What age are we celebrating? (optional)</p>
                <input type="number" id="birthdayAge" name="birthdayAge" class="form-control" min="1" max="150">
            </div>
        </div>

        <div class="form-group">
            <label for="partyTheme">Party Theme</label>
            <p class="field-description">Is there a specific theme or color scheme for the party?</p>
            <input type="text" id="partyTheme" name="partyTheme" class="form-control" placeholder="e.g., Princess theme, Bollywood, Black & Gold">
        </div>`;
    }

    getBabyShowerSpecificBasicFields() {
        return `
        <div class="form-row">
            <div class="form-group">
                <label for="expectingParent">Expecting Parent's Name</label>
                <p class="field-description">Who is the guest of honor?</p>
                <input type="text" id="expectingParent" name="expectingParent" class="form-control">
            </div>

            <div class="form-group">
                <label for="babyGender">Baby's Gender</label>
                <p class="field-description">If you'd like to share (optional)</p>
                <select id="babyGender" name="babyGender" class="form-control">
                    <option value="">Prefer not to say</option>
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Surprise">It's a surprise!</option>
                </select>
            </div>
        </div>`;
    }

    generateEventDetailsStep(eventType) {
        if (eventType === 'Wedding') {
            return this.generateWeddingDetailsStep();
        }

        return `
        <div class="form-step" data-step="1">
            <h3 class="step-title">Event Details</h3>
            <p class="step-description">Help us understand your ${eventType.toLowerCase()} so we can capture every important moment</p>

            <div class="form-row">
                <div class="form-group">
                    <label for="guestCount">Expected Guest Count</label>
                    <p class="field-description">Approximately how many guests will attend?</p>
                    <input type="number" id="guestCount" name="guestCount" class="form-control" min="1" max="10000">
                </div>

                <div class="form-group">
                    <label for="eventDuration">Event Duration</label>
                    <p class="field-description">How long will your event last?</p>
                    <select id="eventDuration" name="eventDuration" class="form-control">
                        <option value="">Select duration</option>
                        <option value="1-2 hours">1-2 hours</option>
                        <option value="3-4 hours">3-4 hours</option>
                        <option value="5-6 hours">5-6 hours</option>
                        <option value="Full day">Full day (8+ hours)</option>
                        <option value="Multiple days">Multiple days</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="eventHighlights">Key Moments to Capture</label>
                <p class="field-description">What are the most important moments or activities during your ${eventType.toLowerCase()}?</p>
                <textarea id="eventHighlights" name="eventHighlights" class="form-control" rows="4" placeholder="e.g., cake cutting, special performances, speeches, family group photos"></textarea>
            </div>

            <div class="form-group">
                <label for="specialRequests">Special Requests or Considerations</label>
                <p class="field-description">Any specific shots, family dynamics, venue restrictions, or cultural elements we should know about?</p>
                <textarea id="specialRequests" name="specialRequests" class="form-control" rows="4"></textarea>
            </div>
        </div>`;
    }

    generateWeddingDetailsStep() {
        return `
        <div class="form-step" data-step="1">
            <h3 class="step-title">Wedding Events & Timeline</h3>
            <p class="step-description">Tell us about all the beautiful events in your wedding celebration so we can capture every precious moment</p>

            <div class="timeline-container">
                <h4>Wedding Events</h4>
                <p style="margin-bottom: 1rem; color: #8B4513;">Please add all the events in your wedding celebration with their details</p>

                <div id="timelineItems">
                    <div class="timeline-item">
                        <div class="timeline-header">
                            <span class="timeline-title">Wedding Event #1</span>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Event Name *</label>
                                <input type="text" name="eventName[]" class="form-control" placeholder="e.g., Mehendi, Sangeet, Ceremony, Reception" required>
                            </div>
                            <div class="form-group">
                                <label>Date & Time</label>
                                <input type="datetime-local" name="eventDateTime[]" class="form-control">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Guest Count</label>
                                <input type="number" name="eventGuests[]" class="form-control" placeholder="Number of expected guests" min="1">
                            </div>
                            <div class="form-group">
                                <label>Duration</label>
                                <select name="eventDuration[]" class="form-control">
                                    <option value="">Select duration</option>
                                    <option value="1-2 hours">1-2 hours</option>
                                    <option value="3-4 hours">3-4 hours</option>
                                    <option value="5-6 hours">5-6 hours</option>
                                    <option value="Full day">Full day</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Event Description</label>
                            <textarea name="eventDescription[]" class="form-control" rows="2" placeholder="Brief description of this event and what makes it special"></textarea>
                        </div>
                    </div>
                </div>

                <button type="button" class="add-timeline-btn">+ Add Another Event</button>
            </div>

            <div class="form-group">
                <label for="loveStory">Your Love Story</label>
                <p class="field-description">Share your beautiful love story with us - how did you meet, what makes your relationship special?</p>
                <textarea id="loveStory" name="loveStory" class="form-control" rows="4" placeholder="Every love story is unique and beautiful. We'd love to hear yours so we can capture the essence of your relationship in our photographs..."></textarea>
            </div>

            <div class="form-group">
                <label for="weddingVision">Your Wedding Vision</label>
                <p class="field-description">Describe your dream wedding photography style and any specific moments that are important to you</p>
                <textarea id="weddingVision" name="weddingVision" class="form-control" rows="4" placeholder="e.g., candid emotional moments, traditional family portraits, artistic couple shots, documentary style coverage..."></textarea>
            </div>
        </div>`;
    }

    generateServicesStep() {
        const services = [
            {
                name: 'Candid Photography',
                description: 'Natural, spontaneous moments captured beautifully as they unfold, telling your authentic story through unposed, genuine emotions'
            },
            {
                name: 'Wedding Film',
                description: 'Cinematic storytelling that transforms your special day into a timeless film, capturing not just images but the feeling of every precious moment'
            },
            {
                name: 'Traditional Photography',
                description: 'Classic, elegant portraits and formal shots that honor tradition while creating timeless memories for generations to treasure'
            },
            {
                name: 'Traditional Video',
                description: 'Professional videography that documents your celebration with classic techniques, preserving every important moment with heritage quality'
            },
            {
                name: 'Album',
                description: 'Beautifully crafted, premium photo albums that transform your favorite images into a tangible keepsake you\'ll treasure forever'
            }
        ];

        let servicesHTML = `
        <div class="form-step" data-step="2">
            <h3 class="step-title">Photography Services</h3>
            <p class="step-description">Select the photography services that will best capture and preserve your precious memories</p>

            <div class="services-grid">`;

        services.forEach((service, index) => {
            servicesHTML += `
                <div class="service-option" data-service="${service.name}">
                    <input type="checkbox" name="services" value="${service.name}" id="service${index}">
                    <div class="checkmark"></div>
                    <div class="service-name">${service.name}</div>
                    <div class="service-description">${service.description}</div>
                </div>`;
        });

        servicesHTML += `
            </div>

            <div class="form-group" style="margin-top: 2rem;">
                <label for="budgetRange">Budget Range (Optional)</label>
                <p class="field-description">This helps us recommend the perfect package for your needs. All information is kept confidential.</p>
                <select id="budgetRange" name="budgetRange" class="form-control">
                    <option value="">Prefer to discuss</option>
                    <option value="Under ₹50,000">Under ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹2,00,000">₹1,00,000 - ₹2,00,000</option>
                    <option value="₹2,00,000 - ₹3,00,000">₹2,00,000 - ₹3,00,000</option>
                    <option value="Above ₹3,00,000">Above ₹3,00,000</option>
                </select>
            </div>

            <div class="form-group">
                <label for="additionalRequests">Additional Requests or Questions</label>
                <p class="field-description">Is there anything else you'd like us to know about your photography needs or vision?</p>
                <textarea id="additionalRequests" name="additionalRequests" class="form-control" rows="4" placeholder="Any specific equipment needs, travel requirements, accommodation arrangements, or creative ideas you'd like to discuss..."></textarea>
            </div>
        </div>`;

        return servicesHTML;
    }

    generateReviewStep() {
        return `
        <div class="form-step" data-step="3">
            <h3 class="step-title">Review & Submit</h3>
            <p class="step-description">Please review your information below and let us know the best way to reach you</p>

            <div class="form-group">
                <label for="preferredContact">Preferred Contact Method</label>
                <p class="field-description">How would you prefer we reach out to discuss your photography needs?</p>
                <select id="preferredContact" name="preferredContact" class="form-control">
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="video-call">Video Call</option>
                </select>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="preferredTime">Best Time to Contact</label>
                    <p class="field-description">When are you usually available?</p>
                    <select id="preferredTime" name="preferredTime" class="form-control">
                        <option value="morning">Morning (9 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                        <option value="evening">Evening (5 PM - 8 PM)</option>
                        <option value="flexible">I'm flexible</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="responseTimeframe">When do you need a response?</label>
                    <p class="field-description">How urgently do you need our proposal?</p>
                    <select id="responseTimeframe" name="responseTimeframe" class="form-control">
                        <option value="asap">As soon as possible</option>
                        <option value="week">Within a week</option>
                        <option value="month">Within a month</option>
                        <option value="planning">Just exploring options</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="finalThoughts">Final Thoughts</label>
                <p class="field-description">Any final details, questions, or thoughts you'd like to share with us?</p>
                <textarea id="finalThoughts" name="finalThoughts" class="form-control" rows="3" placeholder="We're excited to learn more about your vision and how we can make your special day even more memorable..."></textarea>
            </div>

            <div class="review-summary" id="reviewSummary">
                <!-- Summary will be populated here -->
            </div>
        </div>`;
    }

    addTimelineItem() {
        const timelineItems = document.getElementById('timelineItems');
        const currentCount = timelineItems.children.length;

        const newItem = document.createElement('div');
        newItem.className = 'timeline-item';
        newItem.innerHTML = `
            <div class="timeline-header">
                <span class="timeline-title">Wedding Event #${currentCount + 1}</span>
                <button type="button" class="remove-timeline-btn">×</button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Event Name *</label>
                    <input type="text" name="eventName[]" class="form-control" placeholder="e.g., Mehendi, Sangeet, Ceremony, Reception" required>
                </div>
                <div class="form-group">
                    <label>Date & Time</label>
                    <input type="datetime-local" name="eventDateTime[]" class="form-control">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Guest Count</label>
                    <input type="number" name="eventGuests[]" class="form-control" placeholder="Number of expected guests" min="1">
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <select name="eventDuration[]" class="form-control">
                        <option value="">Select duration</option>
                        <option value="1-2 hours">1-2 hours</option>
                        <option value="3-4 hours">3-4 hours</option>
                        <option value="5-6 hours">5-6 hours</option>
                        <option value="Full day">Full day</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Event Description</label>
                <textarea name="eventDescription[]" class="form-control" rows="2" placeholder="Brief description of this event and what makes it special"></textarea>
            </div>`;

        timelineItems.appendChild(newItem);

        // Animate the new item
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            newItem.style.transition = 'all 0.3s ease';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        }, 100);
    }

    removeTimelineItem(item) {
        const timelineItems = document.getElementById('timelineItems');
        if (timelineItems.children.length > 1) {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                item.remove();
                this.updateTimelineNumbers();
            }, 300);
        }
    }

    updateTimelineNumbers() {
        const timelineItems = document.querySelectorAll('#timelineItems .timeline-item');
        timelineItems.forEach((item, index) => {
            const title = item.querySelector('.timeline-title');
            title.textContent = `Wedding Event #${index + 1}`;
        });
    }

    updateServiceSelection(checkbox) {
        const serviceOption = checkbox.closest('.service-option');
        if (checkbox.checked) {
            serviceOption.classList.add('selected');
        } else {
            serviceOption.classList.remove('selected');
        }
    }

    showFormSection() {
        document.getElementById('welcomeSection').classList.remove('active');
        document.getElementById('formSection').classList.add('active');
    }

    showProgress() {
        const progressContainer = document.getElementById('progressContainer');
        progressContainer.classList.remove('hidden');
    }

    showStep(stepIndex) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStep = document.querySelector(`[data-step="${stepIndex}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }

        this.currentStep = stepIndex;
        this.updateProgress();
        this.updateNavigation();

        // If on review step, populate summary
        if (stepIndex === 3) {
            this.populateReviewSummary();
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            if (this.validateCurrentStep()) {
                this.collectCurrentStepData();
                this.showStep(this.currentStep + 1);
            }
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#DC143C';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields before continuing.');
        }

        return isValid;
    }

    collectCurrentStepData() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        const formData = new FormData();
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (input.checked) {
                    if (!this.formData[input.name]) {
                        this.formData[input.name] = [];
                    }
                    this.formData[input.name].push(input.value);
                }
            } else if (input.name) {
                this.formData[input.name] = input.value;
            }
        });
    }

    updateProgress() {
        const progress = ((this.currentStep + 1) / this.totalSteps) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        // Update step indicators
        document.querySelectorAll('.progress-steps .step').forEach((step, index) => {
            if (index <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        // Show/hide previous button
        if (this.currentStep === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        // Show/hide next/submit button
        if (this.currentStep === this.totalSteps - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    populateReviewSummary() {
        const summaryElement = document.getElementById('reviewSummary');
        let summaryHTML = '<h4>Your Inquiry Summary</h4>';

        summaryHTML += `
        <div style="background: #FFF8F0; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
            <h5>Event Details</h5>
            <p><strong>Event Type:</strong> ${this.selectedEvent}</p>
            <p><strong>Client:</strong> ${this.formData.clientName || 'Not provided'}</p>
            <p><strong>Email:</strong> ${this.formData.clientEmail || 'Not provided'}</p>
            <p><strong>Event Date:</strong> ${this.formData.eventDate || 'Not provided'}</p>
            <p><strong>Venue:</strong> ${this.formData.eventVenue || 'Not provided'}</p>
        </div>`;

        if (this.formData.services && this.formData.services.length > 0) {
            summaryHTML += `
            <div style="background: #FFF8F0; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
                <h5>Selected Services</h5>
                <ul style="margin: 0; padding-left: 1.5rem;">`;

            this.formData.services.forEach(service => {
                summaryHTML += `<li>${service}</li>`;
            });

            summaryHTML += '</ul></div>';
        }

        summaryElement.innerHTML = summaryHTML;
    }

    submitForm(e) {
        e.preventDefault();

        if (!this.validateCurrentStep()) {
            return;
        }

        this.collectCurrentStepData();

        // Simulate form submission
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simulate API call delay
        setTimeout(() => {
            this.showThankYouSection();
        }, 2000);
    }

    showThankYouSection() {
        document.getElementById('formSection').classList.remove('active');
        document.getElementById('thankYouSection').classList.add('active');
        document.getElementById('progressContainer').classList.add('hidden');

        // Scroll to top
        window.scrollTo(0, 0);
    }

    resetForm() {
        this.currentStep = 0;
        this.selectedEvent = null;
        this.formData = {};
        this.eventTimelineItems = [];

        // Hide all sections except welcome
        document.getElementById('formSection').classList.remove('active');
        document.getElementById('thankYouSection').classList.remove('active');
        document.getElementById('welcomeSection').classList.add('active');
        document.getElementById('progressContainer').classList.add('hidden');

        // Reset event cards
        document.querySelectorAll('.event-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Clear dynamic content
        const dynamicContent = document.getElementById('dynamicContent');
        if (dynamicContent) {
            dynamicContent.innerHTML = '';
        }

        this.updateProgress();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotographyInquiryForm();
});

// Add some utility functions for enhanced UX
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for form sections
    const smoothScroll = (element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Add focus effects to form controls
    document.addEventListener('focus', (e) => {
        if (e.target.classList.contains('form-control')) {
            e.target.parentElement.classList.add('form-group-focused');
        }
    }, true);

    document.addEventListener('blur', (e) => {
        if (e.target.classList.contains('form-control')) {
            e.target.parentElement.classList.remove('form-group-focused');
        }
    }, true);

    // Add loading states for better UX
    const addLoadingState = (element, duration = 1000) => {
        element.classList.add('loading');
        setTimeout(() => {
            element.classList.remove('loading');
        }, duration);
    };
});