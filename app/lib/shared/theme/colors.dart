import 'package:flutter/material.dart';
import '../../core/constants.dart';

/// Nyuchi Brand v6 color extensions for easy access
extension MukokoColorScheme on ColorScheme {
  Color get tanzanite => brightness == Brightness.light
      ? const Color(MukokoColors.tanzaniteLight)
      : const Color(MukokoColors.tanzaniteDark);

  Color get cobalt => brightness == Brightness.light
      ? const Color(MukokoColors.cobaltLight)
      : const Color(MukokoColors.cobaltDark);

  Color get gold => brightness == Brightness.light
      ? const Color(MukokoColors.goldLight)
      : const Color(MukokoColors.goldDark);

  Color get malachite => brightness == Brightness.light
      ? const Color(MukokoColors.malachiteLight)
      : const Color(MukokoColors.malachiteDark);

  Color get terracotta => brightness == Brightness.light
      ? const Color(MukokoColors.terracottaLight)
      : const Color(MukokoColors.terracottaDark);
}
