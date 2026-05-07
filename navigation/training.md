---
layout: post
title: Training Hub
nav: true
search_exclude: true
permalink: /training-hub/
---

{% assign food_safety_pdf = '/assets/pdfs/training/food-safety-handbook.pdf' | relative_url %}
{% assign donor_checklist_pdf = '/assets/pdfs/training/donor-checklist.pdf' | relative_url %}
{% assign receiver_checklist_pdf = '/assets/pdfs/training/receiver-checklist.pdf' | relative_url %}

<div class="training-hub-page">
	<section class="training-hub-hero">
		<p class="training-hub-hero__eyebrow">Training Hub</p>
		<h1>Volunteer training materials, checklists, and interactive practice in one place.</h1>
		<p>
			Review the reference materials, then jump into Base Game Part 1 to practice movement, station
			discovery, and the Hunger Heroes donation flow inside the Training Hub.
		</p>
		<div class="training-hub-hero__actions">
			<a class="training-hub-button training-hub-button--primary" href="#training-base-game-part-1">Launch Base Game Part 1</a>
			<a class="training-hub-button training-hub-button--secondary" href="#training-resources">Review training resources</a>
		</div>
	</section>

	<section class="training-hub-section" id="training-resources">
		<div class="training-hub-section__header">
			<h2>Training Resources</h2>
			<p>
				Each file will show a cover-page preview here. Clicking the preview opens a fullscreen viewer for the
				full PDF.
			</p>
		</div>

		<div class="training-hub-grid">
			<article class="training-hub-card">
				<div class="training-hub-card__tag">General</div>
				<h3>Food Safety Handbook</h3>
				<p>Food handling standards, storage guidance, and volunteer safety procedures.</p>
				<div class="training-hub-pdf" data-pdf-title="Food Safety Handbook" data-pdf-src="{{ food_safety_pdf }}">
					<button class="training-hub-pdf__button" type="button" disabled>
						<span class="training-hub-pdf__viewer">
							<canvas class="training-hub-pdf__canvas" aria-hidden="true"></canvas>
							<span class="training-hub-pdf__placeholder">
								<strong>Food Safety Handbook</strong>
								<span class="training-hub-pdf__placeholder-note">Cover preview loads automatically when the PDF is available.</span>
							</span>
							<span class="training-hub-pdf__overlay">Open fullscreen</span>
						</span>
					</button>
					<div class="training-hub-pdf__meta">
						<a class="training-hub-pdf__link" href="{{ food_safety_pdf }}" target="_blank" rel="noopener">Open in new tab</a>
						<p class="training-hub-pdf__status">Expected file: <span>assets/pdfs/training/food-safety-handbook.pdf</span></p>
					</div>
				</div>
			</article>

			<article class="training-hub-card">
				<div class="training-hub-card__tag">Donors</div>
				<h3>Donor Checklist</h3>
				<p>Donor-side prep steps, packaging rules, and handoff reminders before pickup.</p>
				<div class="training-hub-pdf" data-pdf-title="Donor Checklist" data-pdf-src="{{ donor_checklist_pdf }}">
					<button class="training-hub-pdf__button" type="button" disabled>
						<span class="training-hub-pdf__viewer">
							<canvas class="training-hub-pdf__canvas" aria-hidden="true"></canvas>
							<span class="training-hub-pdf__placeholder">
								<strong>Donor Checklist</strong>
								<span class="training-hub-pdf__placeholder-note">Cover preview loads automatically when the PDF is available.</span>
							</span>
							<span class="training-hub-pdf__overlay">Open fullscreen</span>
						</span>
					</button>
					<div class="training-hub-pdf__meta">
						<a class="training-hub-pdf__link" href="{{ donor_checklist_pdf }}" target="_blank" rel="noopener">Open in new tab</a>
						<p class="training-hub-pdf__status">Expected file: <span>assets/pdfs/training/donor-checklist.pdf</span></p>
					</div>
				</div>
			</article>

			<article class="training-hub-card">
				<div class="training-hub-card__tag">Receivers</div>
				<h3>Receiver Checklist</h3>
				<p>Receiver intake steps, confirmation flow, and delivery acceptance checks.</p>
				<div class="training-hub-pdf" data-pdf-title="Receiver Checklist" data-pdf-src="{{ receiver_checklist_pdf }}">
					<button class="training-hub-pdf__button" type="button" disabled>
						<span class="training-hub-pdf__viewer">
							<canvas class="training-hub-pdf__canvas" aria-hidden="true"></canvas>
							<span class="training-hub-pdf__placeholder">
								<strong>Receiver Checklist</strong>
								<span class="training-hub-pdf__placeholder-note">Cover preview loads automatically when the PDF is available.</span>
							</span>
							<span class="training-hub-pdf__overlay">Open fullscreen</span>
						</span>
					</button>
					<div class="training-hub-pdf__meta">
						<a class="training-hub-pdf__link" href="{{ receiver_checklist_pdf }}" target="_blank" rel="noopener">Open in new tab</a>
						<p class="training-hub-pdf__status">Expected file: <span>assets/pdfs/training/receiver-checklist.pdf</span></p>
					</div>
				</div>
			</article>
		</div>
	</section>

	<section class="training-hub-section" id="training-base-game-part-1">
		<div class="training-hub-section__header">
			<h2>Practice and Assessment</h2>
			<p>Move from passive review into an interactive lesson built on the existing Hunger Heroes game engine.</p>
		</div>

		<div class="training-hub-lower">
			<article class="training-hub-quiz">
				<h3>Training Quiz</h3>
				<p>
					This section is reserved for a future quiz or checkpoint experience once the questions and scoring
					flow are finalized.
				</p>
				<ul class="training-hub-quiz__list">
					<li>Title area is in place for a future quiz module.</li>
					<li>Space is reserved for instructions, score feedback, or completion messaging.</li>
					<li>The final embed, form, or script can be mounted here later.</li>
				</ul>
			</article>

			<article class="training-hub-game" data-training-game-root>
				<div class="training-hub-game__header">
					<div>
						<p class="training-hub-game__eyebrow">Base Game Part 1</p>
						<h3>Training Mission</h3>
					</div>
					<span class="training-hub-game__status-badge" data-training-game-status>Ready to launch</span>
				</div>
				<p>
					Practice the core Hunger Heroes loop in a guided training-only run. The lesson now uses its own
					onboarding floor while still running on the shared GameEngine v1.1 project setup.
				</p>
				<ul class="training-hub-game__objectives">
					<li>Learn the movement controls and how to open NPC dialogue.</li>
					<li>Find all five training checkpoints mapped to the Hunger Heroes flow.</li>
					<li>Use the Training Hub as the launch point before moving into the full donation experience.</li>
				</ul>
				<div class="training-hub-game__actions">
					<button class="training-hub-button training-hub-button--primary" type="button" data-training-game-start>Start training run</button>
					<button class="training-hub-button training-hub-button--secondary" type="button" data-training-game-fullscreen>Go full screen</button>
					<button class="training-hub-button training-hub-button--secondary" type="button" data-training-game-help>Show controls</button>
					<a class="training-hub-button training-hub-button--ghost" href="{{ '/donate/game' | relative_url }}">Open full game page</a>
				</div>
				<div class="training-hub-game__stats">
					<div class="training-hub-game__stat">
						<span class="training-hub-game__stat-label">Stations found</span>
						<strong data-training-game-stat="stations">0/5</strong>
					</div>
					<div class="training-hub-game__stat">
						<span class="training-hub-game__stat-label">Dialogues opened</span>
						<strong data-training-game-stat="dialogues">0</strong>
					</div>
					<div class="training-hub-game__stat">
						<span class="training-hub-game__stat-label">Time in lesson</span>
						<strong data-training-game-stat="time">0:00</strong>
					</div>
				</div>
				<div class="training-hub-game__progress" aria-label="Lesson progress">
					<div class="training-hub-game__progress-bar">
						<span class="training-hub-game__progress-fill" data-training-game-progress-fill></span>
					</div>
					<span class="training-hub-game__progress-label" data-training-game-progress-label>0% complete</span>
				</div>
				<p class="training-hub-game__mission" data-training-game-mission>
					Launch the training run, then use WASD to move and E to interact with your first checkpoint.
				</p>
				<div class="training-hub-game__shell">
					<div class="training-hub-game__stage" id="gameArea">
						<div class="training-hub-game__container" id="gameContainer" tabindex="0">
							<div id="promptDropDown" class="promptDropDown"></div>
							<canvas id="gameCanvas" aria-hidden="true"></canvas>
						</div>
						<div class="training-hub-game__overlay" data-training-game-overlay>
							<div class="training-hub-game__overlay-card">
								<p class="training-hub-game__overlay-eyebrow">Interactive lesson</p>
								<h4>Train on the onboarding floor</h4>
								<p>
									Start Base Game Part 1 to walk the training floor, clear each checkpoint, and build confidence
									before using the live donation tools.
								</p>
								<div class="training-hub-game__controls-grid" aria-label="Game controls">
									<div><kbd>W A S D</kbd><span>Move</span></div>
									<div><kbd>E</kbd><span>Interact</span></div>
									<div><kbd>Esc</kbd><span>Pause</span></div>
									<div><kbd>Mouse</kbd><span>Open dialogue</span></div>
								</div>
								<div class="training-hub-game__overlay-actions">
									<button class="training-hub-button training-hub-button--primary" type="button" data-training-game-start>Start Base Game Part 1</button>
									<button class="training-hub-button training-hub-button--secondary" type="button" data-training-game-fullscreen>Go full screen</button>
									<button class="training-hub-button training-hub-button--secondary" type="button" data-training-game-dismiss>Continue browsing hub</button>
								</div>
							</div>
						</div>
					</div>
					<div class="training-hub-game__footer">
						<div>
							<strong>Connected experience</strong>
							<p class="training-hub-game__status">
								This lesson now runs on a Training Hub-specific level while still using the shared sprite
								generator, GameEngine v1.1, and project asset pipeline already shipped with the site.
							</p>
						</div>
						<div class="training-hub-game__links">
							<a href="{{ '/donate/create' | relative_url }}">Create</a>
							<a href="{{ '/donate/browse' | relative_url }}">Browse</a>
							<a href="{{ '/donate/scan' | relative_url }}">Scan</a>
						</div>
					</div>
				</div>
			</article>
		</div>
	</section>
</div>

<div class="training-hub-modal" id="training-hub-pdf-modal" hidden>
	<div class="training-hub-modal__backdrop" data-pdf-modal-close></div>
	<div class="training-hub-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="training-hub-pdf-title">
		<div class="training-hub-modal__header">
			<div>
				<p class="training-hub-modal__eyebrow">Document Viewer</p>
				<h2 id="training-hub-pdf-title">Training PDF</h2>
			</div>
			<div class="training-hub-modal__actions">
				<a class="training-hub-modal__link" id="training-hub-pdf-link" href="#" target="_blank" rel="noopener">Open in new tab</a>
				<button class="training-hub-modal__close" type="button" data-pdf-modal-close aria-label="Close document viewer">Close</button>
			</div>
		</div>
		<div class="training-hub-modal__body">
			<iframe class="training-hub-modal__frame" id="training-hub-pdf-frame" title="Training PDF Viewer" loading="lazy"></iframe>
		</div>
	</div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="{{ '/assets/js/training-hub-pdfs.js' | relative_url }}"></script>
<script type="module">
	const root = document.querySelector('[data-training-game-root]');

	try {
		const module = await import('{{ '/assets/js/projects/training-hub/training-game/levels/TrainingHubBaseGame.js' | relative_url }}');
		const initTrainingHubBaseGame = typeof module.default === 'function'
			? module.default
			: module.initTrainingHubBaseGame;

		if (typeof initTrainingHubBaseGame === 'function') {
			initTrainingHubBaseGame(root, {
				basePath: '{{ site.baseurl }}',
			});
		} else {
			console.warn('Training Hub: base game module loaded without an initializer.');
		}
	} catch (error) {
		console.error('Training Hub: failed to load Base Game Part 1.', error);

		const mission = root?.querySelector('[data-training-game-mission]');
		const status = root?.querySelector('[data-training-game-status]');

		if (status) {
			status.textContent = 'Temporarily unavailable';
		}

		if (mission) {
			mission.textContent = 'Base Game Part 1 could not be loaded right now. Please try the full game page instead.';
		}
	}
</script>
